"use client";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";
import { ActiveSettingForm, roomActiveSetSchema } from "@/schemas/setting/room/schemas";
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

export function NewActiveButton({ roomid }: { roomid: string }) {
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
                <NewActiveModal roomid={roomid} isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    )
}

export function NewActiveModal({ roomid , isOpen, setIsOpen }: { roomid: string, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [initialColors] = useState(randomHarmoniousPair);
    const [primaryColor, setPrimaryColor] = useState(initialColors.primary);
    const [secondaryColor, setSecondaryColor] = useState(initialColors.secondary);

    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ActiveSettingForm>({
        mode: "onChange",
        resolver: zodResolver(roomActiveSetSchema )
    });

    const handleCreate = async (data: ActiveSettingForm) => {
        const response = await fetch(`/api/group/${roomid}/setting/active/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
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
                            <GetInputArea
                                type="text"
                                title="액티브 이름"
                                description="액티브의 이름을 입력하세요."
                                registration={register("name")}
                                required={true}
                            />
                            <GetInputArea
                                type="textarea"
                                title="액티브 설명"
                                description="액티브의 설명을 입력하세요."
                                registration={register("description")}
                                required={true}
                                isLong={true}
                            />
                            <GetInputArea
                                type="color"
                                title="기본 색상"
                                description="액티브의 대표 색상을 선택하세요."
                                defaultColor={primaryColor}
                                onColorChange={setPrimaryColor}
                                registration={register("primaryColor")}
                            />
                            <GetInputArea
                                type="color"
                                title="보조 색상"
                                description="액티브의 보조 색상을 선택하세요."
                                defaultColor={secondaryColor}
                                onColorChange={setSecondaryColor}
                                registration={register("secondaryColor")}
                            />
                            <div className="my-6 px-4">
                                <button
                                    type="submit"
                                    style={{
                                        backgroundImage: `linear-gradient(135deg, ${primaryColor} 60%, ${secondaryColor} 100%)`,
                                        color: text.color,
                                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 0 1px rgba(0,0,0,0.08), 0 10px 24px -10px ${primaryColor}`,
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold transition-all duration-200 hover:brightness-[1.04] active:scale-[0.99]"
                                >
                                    <Check size={18} strokeWidth={2.75} />
                                    <span style={{ textShadow: text.textShadow }}>생성하기</span>
                                </button>
                            </div>
                        </form>

                    </ModalContent>
                </Modal>
            )}
        </>
    )
}