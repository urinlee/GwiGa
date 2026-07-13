"use client";

import { ChevronRight, Info, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardFastSettingButtonProps {
    icon?: React.ReactNode;
    label: string;
    onClick: () => void;
}

function DashboardFastSettingButton({ icon, label, onClick }: DashboardFastSettingButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm active:scale-[0.99] dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/60"
        >
            {icon && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-zinc-900">
                    {icon}
                </span>
            )}
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{label}</span>
            <ChevronRight
                size={16}
                className="ml-auto shrink-0 text-zinc-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-400 dark:text-zinc-600"
            />
        </button>
    );
}

export default function DashboardFastSetting({ groupId }: { groupId: string }) {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
                <DashboardFastSettingButton
                    icon={<Settings size={18} />}
                    label="설정 하러 가기"
                    onClick={() => router.push(`/setting/group/${groupId}/general`)}
                />
            </div>
            <div className="flex-1">
                <DashboardFastSettingButton
                    icon={<Info size={18} />}
                    label="공지사항 추가하기"
                    onClick={() => router.push(`/group/${groupId}/notices/new`)}
                />
            </div>
        </div>
    );
}

//TODO: 추후 modal로 공지사항 추가하게 만들기
