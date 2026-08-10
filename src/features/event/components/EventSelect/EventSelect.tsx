"use client";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { SettingContainer } from "@/components/ui/SettingContainer/SettingContainer";
import { useQuery } from "@tanstack/react-query";
import type { UseFormRegisterReturn } from "react-hook-form";

interface EventOption {
    id: string;
    name: string;
}

interface EventSelectProps {
    groupId: string;
    /** 쓰는 쪽에서 register("eventId") 결과를 넘긴다 */
    registration?: UseFormRegisterReturn;
    /** 값이 있으면 고르지 못하고 이 이벤트로 고정된다 */
    lockedEventId?: string;
    title?: string;
}

/** 그룹의 이벤트 중 하나를 고른다. 이벤트 안에서 열렸다면 lockedEventId로 고정한다. */
export function EventSelect({ groupId, registration, lockedEventId, title = "소속 이벤트" }: EventSelectProps) {
    const { data: events, isLoading, isError } = useQuery<EventOption[]>({
        queryKey: ["groupEvents", groupId],
        queryFn: async () => {
            const res = await fetch(`/api/v1/group/${groupId}/event`);
            if (!res.ok) throw new Error("이벤트 조회 실패");
            return res.json();
        },
    });

    // 고정일 때도 목록을 받아야 이름을 보여줄 수 있다
    if (lockedEventId) {
        const locked = events?.find((event) => event.id === lockedEventId);
        return (
            <SettingContainer>
                <div className="flex items-center">
                    <div className="flex-1">
                        <p className="text-[18px] font-semibold">{title}</p>
                        <p className="mt-2 text-[12px] text-zinc-500">이 이벤트로 고정됩니다.</p>
                    </div>
                    <p className="w-80 truncate text-right font-medium">
                        {locked?.name ?? (isLoading ? "불러오는 중…" : "이름을 불러오지 못했어요")}
                    </p>
                </div>
            </SettingContainer>
        );
    }

    return (
        <GetInputArea
            type="select"
            title={title}
            description="액티브가 속할 이벤트를 고르세요. 고르지 않으면 그룹 전체 액티브가 됩니다."
            registration={registration}
            options={events?.map((event) => ({ value: event.id, label: event.name })) ?? []}
            placeholder={isLoading ? "불러오는 중…" : isError ? "이벤트를 불러오지 못했어요" : "선택 안 함"}
            error={isError ? "이벤트 목록을 불러오지 못했어요" : undefined}
        />
    );
}
