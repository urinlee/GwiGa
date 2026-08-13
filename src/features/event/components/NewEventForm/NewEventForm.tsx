"use client"

import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { Toogle } from "@/components/ui/Toogle/Toogle";
import { NewRecruitForm } from "@/features/event/components/NewRecruitForm/NewRecruitForm";
import { EventFormValues, eventSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";



export function NewEventForm ({ groupId }: { groupId: string }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState:{errors}} = useForm<EventFormValues>({
        resolver:zodResolver(eventSchema),
        mode:"onChange",

    })
    // 모집 활성화 여부ㅇ
    const [recruitEnabled, setRecruitEnabled] = useState(true);

    const { mutate, isPending, error } = useMutation({
        mutationFn: async (data: EventFormValues) => {
            // 모집 토글이 꺼져 있으면 recruit를 아예 빼서 보낸다.
            // 서버는 data.recruit가 있을 때만 JOIN 액티브를 만든다.
            const payload = recruitEnabled ? data : { ...data, recruit: undefined };

            const res = await fetch(`/api/v1/group/${groupId}/event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("이벤트 생성에 실패했어요");
            return res.json() as Promise<{ id: string }>;
        },
        onSuccess: (event) => {
            queryClient.invalidateQueries({ queryKey: ["groupEvents"] });
            router.push(`/group/${groupId}/event/${event.id}`);
        },
    });

    return(
        <form onSubmit={handleSubmit((data) => mutate(data))}>
            <GetInputArea type="text" title="이벤트 이름" description="이벤트 이름을 입력하시오" required registration={register("name")} error={errors.name?.message}/>
            <GetInputArea type="textarea" title="이벤트 설명" description="이벤트 설명을 입력하시오" isLong registration={register("description")}/>
            <div className="my-10">
                <GetInputArea type="datetime" title="이벤트 시작 시간" description="이벤트 시작 기간을 입력하시오" width="w-100" registration={register("startAt")} error={errors.startAt?.message}/>
                <GetInputArea type="datetime" title="이벤트 종료 시간" description="이벤트 종료 기간을 입력하시오" width="w-100" registration={register("endAt")} error={errors.endAt?.message}/>
            </div>
            <div className="flex">
                {/* 빈 칸이면 undefined로 보낸다. valueAsNumber만 쓰면 ""가 NaN이 되어 검증에 걸린다 */}
                <GetInputArea type="number" title="최소 인원" description="최소인원을 설정할 수 있어요!" positiveOnly
                    registration={register("minMember", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                    error={errors.minMember?.message}/>
                <GetInputArea type="number" title="최대 인원" description="최대인원을 설정할 수 있어요!" positiveOnly
                    registration={register("maxMember", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                    error={errors.maxMember?.message}/>
            </div>
            <div className="pl-5">
                <div className="flex items-center justify-between py-3 border-zinc-400 border-y mt-10">
                    <span className="font-semibold text-[18px]">모집 활성화</span>
                    <Toogle checked={recruitEnabled} onChange={setRecruitEnabled} />
                </div>
                {recruitEnabled && (
                    <NewRecruitForm
                        bind={(name) => ({
                            registration: register(`recruit.${name}`),
                            error: errors.recruit?.[name]?.message,
                        })}
                    />
                )}
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                {error && (
                    <p role="alert" className="text-right text-sm text-red-500">
                        {error.message} 잠시 후 다시 시도해주세요.
                    </p>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={isPending}
                        className="cursor-pointer rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/50"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {isPending ? "만드는 중…" : "이벤트 만들기"}
                    </button>
                </div>
            </div>
        </form>
    )
}