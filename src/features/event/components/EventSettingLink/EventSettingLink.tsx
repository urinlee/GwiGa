import { cn } from "@/lib/cn";
import { Settings } from "lucide-react";
import Link from "next/link";

/** 이벤트 헤더의 설정 진입점. 관리자에게만 보여야 하므로 렌더 여부는 쓰는 쪽이 정한다. */
export function EventSettingLink({
    groupId,
    eventId,
    className,
}: {
    groupId: string;
    eventId: string;
    className?: string;
}) {
    return (
        <Link
            href={`/group/${encodeURIComponent(groupId)}/event/${encodeURIComponent(eventId)}/setting`}
            className={cn(
                "flex min-h-9 items-center gap-1.5 rounded-lg border border-zinc-300 px-3 text-[13px] font-semibold text-zinc-700 transition-colors",
                "hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900",
                "dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/50 dark:focus-visible:ring-zinc-100",
                className,
            )}
        >
            <Settings size={14} strokeWidth={2.25} />
            설정
        </Link>
    );
}
