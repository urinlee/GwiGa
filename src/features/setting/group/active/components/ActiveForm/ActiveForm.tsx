"use client";
import { ActiveFields } from "@/features/active/components/ActiveFields/ActiveFields";
import { ActiveList } from "../ActiveList/ActiveList";
import { ActivePreview } from "@/types/active";
import { ActiveFormValues } from "@/schemas/schemas";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { SaveButton } from "@/features/setting/components/SaveButton/SaveButton";
import Button from "@/components/ui/Button/Button";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { NewActiveButton } from "@/features/active/components/NewActiveModal/NewActiveModal";





export function GroupActiveSettingsForm({ groupid, eventId, activeId }: { groupid: string, eventId?: string, activeId?: string }) {

    const [actives, setActives] = useState<ActivePreview[]>([]);
    const [selectedActive, setSelectedActive] = useState<ActivePreview | undefined>();
    const searchParams = useSearchParams();

    /** 선택은 서버가 다시 돌 필요 없는 화면 상태라, 네비게이션 없이 URL만 갈아끼운다. */
    const selectActive = (active?: ActivePreview) => {
        setSelectedActive(active);

        const params = new URLSearchParams(searchParams.toString());
        if (active) params.set("active", active.id);
        else params.delete("active");

        const query = params.toString();
        window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    };

    // defaultValues는 최초 마운트 때 한 번만 반영된다.
    // 서버에서 불러온 selectedActive를 폼에 반영하려면 반응형인 values를 써야 한다.
    const { register, handleSubmit, formState: {isDirty, isSubmitting} } = useForm<ActiveFormValues>({
        defaultValues: {
            name: "",
            description: "",
            primaryColor: "#F4F4F5",
            secondaryColor: "#57565C",
            eventId: null,
        },
        values: selectedActive && {
            name: selectedActive.name,
            description: selectedActive.description ?? "",
            primaryColor: selectedActive.primaryColor ?? "#F4F4F5",
            secondaryColor: selectedActive.secondaryColor ?? "#57565C",
            eventId: selectedActive.eventId,
        },
    });

    useEffect(() => {
        const fetchActives = async () => {
            const response = await fetch(`/api/v1/group/${groupid}/actives`);
            if (!response.ok) {
                console.error("Failed to fetch actives");
                return;
            }

            const data: ActivePreview[] = await response.json();
            setActives(data);
            // 목록을 받은 뒤라야 URL이 가리키는 액티브를 찾을 수 있다
            setSelectedActive(
                data.find(active => active.id === activeId)
                ?? data.find(active => active.eventId === eventId)
                ?? data[0]
            );
        }
        fetchActives();
    }, [groupid, activeId, eventId]);

    const handleUpdate = async (data: ActiveFormValues) => {
        if (!selectedActive) {
            console.error("No active selected");
            return;
        }

        const response = await fetch(`/api/v1/group/${groupid}/actives/${selectedActive.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Failed to update active");
            return;
        }

        const updatedActive = await response.json();
        setActives(prev => prev.map(active => active.id === updatedActive.id ? updatedActive : active));
        setSelectedActive(updatedActive);
    }

    // 새 액티브 생성 직후: POST가 돌려준 액티브를 목록에 바로 추가하고 선택한다
    const handleCreated = (active: ActivePreview) => {
        setActives(prev => [active, ...prev]);
        selectActive(active);
    }

    const handleDelete = async () => {
        if (!selectedActive) {
            console.error("No active selected");
            return;
        }

        const response = await fetch(`/api/v1/group/${groupid}/actives/${selectedActive.id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            console.error("Failed to delete active");
            return;
        }

        // 지운 것을 뺀 목록에서 다음 선택을 고른다. actives[0]은 방금 지운 것일 수 있다.
        const remains = actives.filter(active => active.id !== selectedActive.id);
        setActives(remains);
        selectActive(remains[0]);
    }



    return (
        <div>
            <NewActiveButton groupid={groupid} onCreated={handleCreated} />
            <div className="h-4" />
            <div className="rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900/40 max-h-100 overflow-y-auto">
                <ActiveList actives={actives} selectedActive={selectedActive} onSelect={selectActive} />
            </div>
            <form className="mt-12 flex flex-col" onSubmit={handleSubmit(handleUpdate)}>
                <ActiveFields
                    register={register}
                    groupId={groupid}
                    primaryColor={selectedActive?.primaryColor ?? "#F4F4F5"}
                    secondaryColor={selectedActive?.secondaryColor ?? "#57565C"}
                />
                {isDirty && !isSubmitting && <SaveButton isSubmitting={isSubmitting} />}
            </form>
            <div className="mt-10 flex justify-end">
                <button className="px-4 py-2 rounded-lg text-sm bg-red-100 text-red-500 hover:text-red-100 hover:bg-red-500 dark:bg-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-200 cursor-pointer" onClick={handleDelete}>
                    액티브 삭제하기
                </button>
            </div>
        </div>
    )
}