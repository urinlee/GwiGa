"use client";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";
import { ActiveFields } from "../ActiveFields/ActiveFields";
import { ActiveSettingForm, groupActiveSetSchema } from "@/schemas/setting/group/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

/** hex 색의 상대 명도(WCAG) */
function channelLuminance(hex: string): number {
    const m = hex.replace(/^#/, "");
    const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
    const int = parseInt(full, 16);
    if (Number.isNaN(int)) return 0;
    const weights = [0.2126, 0.7152, 0.0722];
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255].reduce((acc, v, i) => {
        const s = v / 255;
        const lin = s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        return acc + lin * weights[i];
    }, 0);
}

/** 두 색 위에 얹었을 때 읽히는 글자색 + 미세 그림자 */
function readableText(...hexes: string[]) {
    const avg = hexes.reduce((a, h) => a + channelLuminance(h), 0) / hexes.length;
    const light = avg > 0.45;
    return {
        color: light ? "#18181B" : "#FFFFFF",
        textShadow: light ? "0 1px 2px rgba(255,255,255,0.45)" : "0 1px 3px rgba(0,0,0,0.35)",
    };
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/** 서로 어울리는(유사색 조화) 랜덤 색 한 쌍 */
function randomHarmoniousPair(): { primary: string; secondary: string } {
    const hue = Math.floor(Math.random() * 360);
    const shift = 25 + Math.floor(Math.random() * 35); // 25~60도 이동
    const dir = Math.random() < 0.5 ? -1 : 1;
    return {
        primary: hslToHex(hue, 70, 55),
        secondary: hslToHex((hue + dir * shift + 360) % 360, 68, 66),
    };
}

export function NewActiveButton({ groupid }: { groupid: string }) {
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
                <NewActiveModal groupid={groupid} isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    )
}

export function NewActiveModal({ groupid , isOpen, setIsOpen }: { groupid: string, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [initialColors] = useState(randomHarmoniousPair);
    const [primaryColor, setPrimaryColor] = useState(initialColors.primary);
    const [secondaryColor, setSecondaryColor] = useState(initialColors.secondary);
    // 액티브의 속성이 아니라 "생성 동작"에 대한 플래그라 폼 스키마와 분리해서 관리한다
    const [applyToAll, setApplyToAll] = useState(true);

    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ActiveSettingForm>({
        mode: "onChange",
        resolver: zodResolver(groupActiveSetSchema )
    });

    const handleCreate = async (data: ActiveSettingForm) => {
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