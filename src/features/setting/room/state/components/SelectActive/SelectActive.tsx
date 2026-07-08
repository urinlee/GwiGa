import { ActiveSettingForm } from "@/schemas/setting/room/schemas";


export interface ActivePreview{
    id:string;
    name:string;
    primaryColor:string;
    secondaryColor:string;
}

interface SelectActiveProps {
    actives : ActiveSettingForm[];
}


export function SelectActive({ actives }: SelectActiveProps) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900/40 max-h-100 overflow-y-auto">
            {actives.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-zinc-400 dark:text-zinc-500">
                    아직 생성된 액티브가 없어요
                </div>
            ) : (
                <ul className="flex flex-col gap-1">
                    {actives.map((active, index) => (
                        <li
                            key={index}
                            className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                        >
                            {/* 동심원 스와치 (기본색 / 보조색) */}
                            <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/15"
                                style={{ backgroundColor: active.primaryColor }}
                            >
                                <div
                                    className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10"
                                    style={{ backgroundColor: active.secondaryColor }}
                                />
                            </div>

                            {/* 이름 */}
                            <span className="flex-1 truncate text-lg font-bold text-zinc-800 dark:text-zinc-100">
                                {active.name}
                            </span>

                            {/* 타입 뱃지 */}
                            <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                일반
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

// TODO: state 입력받고 여기 컴포넌트에서 선택된 active를 밑에서 설정할수 있게 해두기