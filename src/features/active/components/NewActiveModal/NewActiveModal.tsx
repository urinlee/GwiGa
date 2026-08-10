"use client";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";
import { ActiveFields } from "../ActiveFields/ActiveFields";
import { ActivePreview } from "@/types/active";
import { ActiveFormValues, activeSchema } from "@/schemas/schemas";
import { makeHarmoniousPair, readableText } from "@/lib/color";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function NewActiveButton({ groupid, onCreated }: { groupid: string, onCreated?: (active: ActivePreview) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
    }

    return (
        <>
            <button
                onClick={handleClick}
                className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-300 px-4 py-5 transition-all hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.99] dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/50"
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 transition-colors group-hover:bg-zinc-800 group-hover:text-white dark:bg-zinc-700 dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-zinc-900">
                    <Plus strokeWidth={3} size={20} />
                </span>
                <span className="text-xl font-bold text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white">
                    새로운 액티브 생성
                </span>
            </button>
            {isOpen && (
                <NewActiveModal groupid={groupid} isOpen={isOpen} setIsOpen={setIsOpen} onCreated={onCreated} />
            )}
        </>
    )
}

export function NewActiveModal({ groupid , eventId, isOpen, setIsOpen, onCreated }: { groupid: string, eventId?: string, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, onCreated?: (active: ActivePreview) => void }) {
    const [initialColors] = useState(makeHarmoniousPair);
    const [primaryColor, setPrimaryColor] = useState(initialColors.primary);
    const [secondaryColor, setSecondaryColor] = useState(initialColors.secondary);
    // 액티브의 속성이 아니라 "생성 동작"에 대한 플래그라 폼 스키마와 분리해서 관리한다
    const [applyToAll, setApplyToAll] = useState(true);

    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ActiveFormValues>({
        mode: "onChange",
        resolver: zodResolver(activeSchema),
        // 이벤트 안에서 열렸으면 소속 이벤트를 고르지 않고 그 이벤트로 시작한다
        defaultValues: { eventId },
    });

    const handleCreate = async (data: ActiveFormValues) => {
        const response = await fetch(`/api/v1/group/${groupid}/actives`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, applyToAll }),
        });
        if (!response.ok) {
            console.error("Failed to create new active");
            console.error(await response.text());
            return;
        }
        // 생성된 액티브를 부모(목록)로 올려 즉시 반영한다. router.refresh()는
        // 클라이언트 useState/useEffect 목록을 되돌리지 못하므로 이것만으로는 안 됐다.
        const created: ActivePreview = await response.json();
        onCreated?.(created);
        setIsOpen(false);
        router.refresh();
    }

    const text = readableText(primaryColor, secondaryColor);
    return (
        <>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <ModalContent className="w-300 h-200 overflow-y-scroll">
                        <form onSubmit={handleSubmit(handleCreate)}>
                            <ActiveFields
                                register={register}
                                groupId={groupid}
                                lockedEventId={eventId}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                                onPrimaryColorChange={setPrimaryColor}
                                onSecondaryColorChange={setSecondaryColor}
                            />
                            <div className="my-6 flex items-center gap-3 px-4">
                                <button
                                    type="submit"
                                    style={{
                                        backgroundImage: `linear-gradient(135deg, ${primaryColor} 60%, ${secondaryColor} 100%)`,
                                        color: text.color,
                                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 0 1px rgba(0,0,0,0.08), 0 10px 24px -10px ${primaryColor}`,
                                    }}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold transition-all duration-200 hover:brightness-[1.04] active:scale-[0.99]"
                                >
                                    <Check size={18} strokeWidth={2.75} />
                                    <span style={{ textShadow: text.textShadow }}>생성하기</span>
                                </button>

                                {/* 체크하면 applyToAll: true 로 전송된다 (서버에서 모든 멤버에게 적용) */}
                                <label className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-300 px-4 py-3.5 transition-colors select-none hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800/50">
                                    <input
                                        type="checkbox"
                                        name="applyToAll"
                                        checked={applyToAll}
                                        onChange={(e) => setApplyToAll(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-zinc-300 transition-colors peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-400 dark:border-zinc-600 dark:peer-checked:border-white dark:peer-checked:bg-white">
                                        <Check size={13} strokeWidth={4} className="text-white opacity-0 transition-opacity dark:text-zinc-900" />
                                    </span>
                                    <span className="text-sm font-semibold whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                                        모두에게 적용하기
                                    </span>
                                </label>
                            </div>
                        </form>

                    </ModalContent>
                </Modal>
            )}
        </>
    )
}
