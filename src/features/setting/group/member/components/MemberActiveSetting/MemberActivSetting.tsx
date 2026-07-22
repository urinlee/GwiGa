import type { Active } from "@/generated/prisma/client";
import type { MemberActiveItem } from "@/schemas/schemas";
import type { GroupMemberActives } from "../MemberForm/MemberForm";
import { CircleMinus, CirclePlus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ActiveList } from "../../../active/components/ActiveList/ActiveList";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";
import { MemberActiveDetailForm } from "./MemberActiveDetailForm";


interface MemberActiveSettingProps {
    groupId: string;
    userId?: string;
    groupAllActives: Active[];
    assignedMemberActives: GroupMemberActives[];
    onSaved: () => void;
}


export function AddMemberActiveModal({isOpen, onClose, groupAllActives, assignedActives, handleClickActive}: {isOpen: boolean, onClose: () => void, groupAllActives: Active[], assignedActives: Active[], handleClickActive: (active: Active) => void}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <div className="flex h-100 w-100 flex-col">
                    <h2 className="shrink-0 text-lg font-bold">이 그룹의 모든 액티브</h2>
                    <p className="mb-2 shrink-0 text-sm text-zinc-500">클릭해서 이 멤버에게 배정하거나 해제하세요</p>
                    <div className="flex-1 overflow-y-auto">
                        {groupAllActives.map((active) => {
                            const isAssigned = assignedActives.some((assigned) => assigned.id === active.id);
                            return (
                                <button
                                    type="button"
                                    key={active.id}
                                    onClick={() => handleClickActive(active)}
                                    className="flex w-full items-center justify-between rounded-lg border-b border-zinc-100 p-2.5 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/15" style={{backgroundColor: active.primaryColor ?? "#F4F4F5"}} />
                                        <span className="font-medium">{active.name}</span>
                                    </div>
                                    {isAssigned
                                        ? <CircleMinus className="text-red-500" size={20} />
                                        : <CirclePlus className="text-emerald-500" size={20} />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </ModalContent>
        </Modal>
    )
}


/** 서버 행 → draft 항목. 날짜는 API에서 문자열로 오므로 Date로 정규화한다. */
function toDraft(rows: GroupMemberActives[]): MemberActiveItem[] {
    return rows.map((row) => ({
        activeId: row.activeId,
        enable: row.enable,
        startAt: row.startAt ? new Date(row.startAt) : null,
        endAt: row.endAt ? new Date(row.endAt) : null,
    }));
}


export function MemberActiveSetting({ groupId, userId, groupAllActives, assignedMemberActives, onSaved }: MemberActiveSettingProps) {
    // 저장 전까지 모든 변경(할당/해제/기간)은 이 draft 하나에서만 논다.
    const [draft, setDraft] = useState<MemberActiveItem[]>(() => toDraft(assignedMemberActives));
    const [selectedId, setSelectedId] = useState<string | undefined>(assignedMemberActives[0]?.activeId);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // 배정 데이터(prop)가 바뀌면 draft·선택을 다시 잡는다: 멤버 전환, 저장 후 재조회,
    // 그리고 부모가 fetch로 한 박자 늦게 채우는 경우까지. 렌더 중 조정(effect 아님)이라
    // 타이밍 어긋남이 없다. (React "You Might Not Need an Effect" 패턴)
    const [syncedFrom, setSyncedFrom] = useState(assignedMemberActives);
    if (assignedMemberActives !== syncedFrom) {
        setSyncedFrom(assignedMemberActives);
        setDraft(toDraft(assignedMemberActives));
        setSelectedId((prev) =>
            prev && assignedMemberActives.some((row) => row.activeId === prev)
                ? prev
                : assignedMemberActives[0]?.activeId,
        );
    }

    // 표시용 Active 조회: 그룹 전체 + 배정 행에 딸려온 active를 합쳐 항상 찾을 수 있게
    const activeById = useMemo(() => {
        const map = new Map<string, Active>();
        groupAllActives.forEach((a) => map.set(a.id, a));
        assignedMemberActives.forEach((row) => map.set(row.activeId, row.active));
        return map;
    }, [groupAllActives, assignedMemberActives]);

    const draftActives = draft
        .map((d) => activeById.get(d.activeId))
        .filter((a): a is Active => Boolean(a));

    const selectedDraft = draft.find((d) => d.activeId === selectedId);
    const selectedActive = selectedId ? activeById.get(selectedId) : undefined;

    // 할당/해제: draft에서 넣고 뺀다 (목록·모달이 이 draft를 함께 보므로 즉시 동기화)
    const toggleAssign = (active: Active) => {
        setDraft((prev) =>
            prev.some((d) => d.activeId === active.id)
                ? prev.filter((d) => d.activeId !== active.id)
                : [...prev, { activeId: active.id, enable: false, startAt: null, endAt: null }]
        );
    };

    // 선택된 액티브의 멤버별 설정 수정 (detail form에서 호출)
    const patchSelected = (patch: Partial<MemberActiveItem>) => {
        if (!selectedId) return;
        setDraft((prev) => prev.map((d) => (d.activeId === selectedId ? { ...d, ...patch } : d)));
    };

    const handleSave = async () => {
        if (!userId) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/v1/group/${groupId}/member/${userId}/actives`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actives: draft }),
            });
            if (!res.ok) {
                console.error("Failed to save member actives", res.status);
                return;
            }
            onSaved();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-bold">멤버별 액티브 설정</h2>
                <p className="text-sm text-zinc-500">이 멤버에게 액티브를 배정하고 기간을 설정해요</p>
            </div>

            {/* 배정된 액티브 목록 + 추가 */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        배정된 액티브 <span className="ml-1 text-zinc-400">{draftActives.length}</span>
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800/50"
                    >
                        <Plus size={16} strokeWidth={2.5} /> 액티브 관리
                    </button>
                </div>
                <div className="max-h-80 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900/40">
                    <ActiveList actives={draftActives} selectedActive={selectedActive} onSelect={(a) => setSelectedId(a.id)} />
                </div>
            </div>

            {/* 선택된 액티브의 멤버별 설정 (분리된 컴포넌트) */}
            {selectedActive && selectedDraft ? (
                <MemberActiveDetailForm
                    key={selectedId}
                    active={selectedActive}
                    value={selectedDraft}
                    onChange={patchSelected}
                />
            ) : (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-400 dark:border-zinc-600 dark:text-zinc-500">
                    위에서 액티브를 선택하면 이 멤버의 설정을 편집할 수 있어요
                </div>
            )}

            {/* 저장 */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !userId}
                    className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-700 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    {isSaving ? "저장 중…" : "액티브 설정 저장"}
                </button>
            </div>

            {isAddOpen && (
                <AddMemberActiveModal
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    groupAllActives={groupAllActives}
                    assignedActives={draftActives}
                    handleClickActive={toggleAssign}
                />
            )}
        </div>
    );
}
