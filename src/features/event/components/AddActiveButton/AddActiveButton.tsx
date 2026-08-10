"use client";
import { NewActiveModal } from "@/features/active/components/NewActiveModal/NewActiveModal";
import { Plus } from "lucide-react";
import { useState } from "react";

/** 이벤트 상세에서 액티브를 추가한다. 그룹 설정과 달리 소속 이벤트는 이 페이지의 이벤트로 고정된다. */
export function AddActiveButton({ groupId, eventId }: { groupId: string; eventId: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 px-2.5 py-1.5 text-[13px] font-semibold text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
            >
                <Plus size={14} strokeWidth={2.75} />
                액티브 추가
            </button>

            {isOpen && <NewActiveModal groupid={groupId} eventId={eventId} isOpen={isOpen} setIsOpen={setIsOpen} />}
        </>
    );
}
