import { Gauge } from "@/components/ui/Gauge/Gauge";
import type { EventStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import { formatPeriod } from "@/lib/date";
import { CalendarDays, ChevronLeft, Clock, Users } from "lucide-react";
import type { ReactNode } from "react";

/** EventCard와 같은 색을 써서 목록 → 상세로 넘어와도 상태가 같게 읽힌다. */
const STATUS_STYLE: Record<EventStatus, { label: string; textColor: string; bgColor: string }> = {
    RECRUITING: { label: "모집중", textColor: "#0F9D63", bgColor: "#e6f6ee" },
    ONGOING: { label: "진행중", textColor: "#2563eb", bgColor: "#e9f1fe" },
    CLOSED: { label: "종료됨", textColor: "#6B7280", bgColor: "#f3f4f6" },
};

interface EventHeroProps {
    groupId: string;
    name: string;
    description?: string | null;
    status: EventStatus;
    startAt?: Date | null;
    endAt?: Date | null;
    /** 확정 참가자 수 (EventMember where status=CONFIRMED) */
    memberCount: number;
    minMember?: number | null;
    maxMember?: number | null;
    /** 참여하기·수정 같은 버튼. 동작은 쓰는 쪽이 정한다. */
    action?: ReactNode;
}

export function EventHero({
    groupId,
    name,
    description,
    status,
    startAt,
    endAt,
    memberCount,
    minMember,
    maxMember,
    action,
}: EventHeroProps) {
    const style = STATUS_STYLE[status];
    const { date, time } = formatPeriod(startAt, endAt);

    const reachedMin = Boolean(minMember && memberCount >= minMember);
    const isFull = Boolean(maxMember && memberCount >= maxMember);

    return (
        <header className="pt-10">
            <a
                href={`/group/${groupId}/dashboard`}
                className="inline-flex items-center gap-0.5 text-[12px] text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
            >
                <ChevronLeft className="h-3.5 w-3.5" />
                이벤트 목록으로
            </a>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: style.bgColor, color: style.textColor }}
                    >
                        {style.label}
                    </span>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance">{name}</h1>
                    {description && (
                        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {description}
                        </p>
                    )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-zinc-400" />
                    {date}
                </span>
                {time && (
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        {time}
                    </span>
                )}
                <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <span className="tabular-nums text-zinc-700 dark:text-zinc-200">{memberCount}명</span> 참여
                </span>
            </div>

            {/* 정원이 정해진 이벤트에만 게이지를 보여준다 */}
            {(minMember || maxMember) && (
                <div className="mt-5 max-w-xl">
                    <div className="mb-1.5 flex justify-between text-[13px] font-medium">
                        <span className="text-zinc-400">
                            {minMember && <span className={cn(reachedMin && "text-emerald-700 dark:text-emerald-400")}>최소 {minMember}명</span>}
                            {minMember && maxMember && " · "}
                            {maxMember && <span className={cn(isFull && "text-rose-600 dark:text-rose-400")}>최대 {maxMember}명</span>}
                        </span>
                        <span
                            className={cn(
                                "tabular-nums text-zinc-400",
                                reachedMin && "text-emerald-700 dark:text-emerald-400",
                                isFull && "text-rose-600 dark:text-rose-400",
                            )}
                        >
                            {memberCount}
                            {maxMember ? `/${maxMember}` : ""}명{reachedMin && !isFull && " · 최소 달성"}
                            {isFull && " · 정원 마감"}
                        </span>
                    </div>
                    <Gauge
                        value={memberCount}
                        max={maxMember ?? minMember ?? 1}
                        color={isFull ? "#c13c35" : reachedMin ? "#016630" : undefined}
                        markers={minMember && maxMember ? [{ value: minMember, label: `최소 모집인원 ${minMember}명` }] : undefined}
                        ariaLabel="정원 대비 현재 인원"
                    />
                </div>
            )}

            <div className="mt-8 border-b border-zinc-200 dark:border-zinc-800" />
        </header>
    );
}
