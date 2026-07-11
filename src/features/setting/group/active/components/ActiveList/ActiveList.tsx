import { cn } from "@/lib/cn";
import { ActivePreview } from "@/types/active";
import { Check } from "lucide-react";

interface ActiveListProps {
    actives: ActivePreview[];
    selectedActive?: ActivePreview;
    onSelect?: (active: ActivePreview) => void;
}


export function ActiveList({ actives, selectedActive, onSelect }: ActiveListProps) {
    return (
        <>
            {actives.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-zinc-400 dark:text-zinc-500">
                    아직 생성된 액티브가 없어요
                </div>
            ) : (
                <ul role="listbox" className="flex flex-col gap-1">
                    {actives.map((active) => {
                        const isSelected = selectedActive?.id === active.id;
                        return (
                        <li
                            key={active.id}
                            role="option"
                            aria-selected={isSelected}
                            className={cn(
                                "group relative flex cursor-pointer items-center gap-4 rounded-lg px-3 py-3 transition-all select-none",
                                isSelected
                                    ? "bg-zinc-100 ring-1 ring-inset ring-zinc-900/10 dark:bg-zinc-800 dark:ring-white/15"
                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                            )}
                            onClick={() => onSelect && onSelect(active)}
                        >
                            {/* 선택 표시: 왼쪽 액센트 바 */}
                            {isSelected && (
                                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-zinc-900 dark:bg-zinc-100" />
                            )}

                            {/* 동심원 스와치 (기본색 / 보조색) */}
                            <div
                                className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-transform",
                                    isSelected
                                        ? "scale-110 ring-black/20 dark:ring-white/30"
                                        : "ring-black/10 dark:ring-white/15"
                                )}
                                style={{ backgroundColor: active.primaryColor ?? "#F4F4F5" }}
                            >
                                <div
                                    className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10"
                                    style={{ backgroundColor: active.secondaryColor ?? "#57565C" }}
                                />
                            </div>

                            {/* 이름 */}
                            <span
                                className={cn(
                                    "flex-1 truncate text-lg transition-colors",
                                    isSelected
                                        ? "font-extrabold text-zinc-900 dark:text-white"
                                        : "font-bold text-zinc-800 dark:text-zinc-100"
                                )}
                            >
                                {active.name}
                            </span>

                            {/* 선택 표시: 체크 */}
                            {isSelected && (
                                <Check size={18} strokeWidth={3} className="shrink-0 text-zinc-900 dark:text-white" />
                            )}

                            {/* 타입 뱃지 */}
                            <span
                                className={cn(
                                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                                    isSelected
                                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                )}
                            >
                                일반
                            </span>
                        </li>
                        );
                    })}
                </ul>
            )}
        </>
    )
}

// TODO: state 입력받고 여기 컴포넌트에서 선택된 active를 밑에서 설정할수 있게 해두기