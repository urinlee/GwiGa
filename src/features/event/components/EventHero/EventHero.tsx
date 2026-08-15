import { Gauge } from "@/components/ui/Gauge/Gauge";
import type { EventStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import { formatPeriod, isSameDay } from "@/lib/date";
import { EVENT_STATUS } from "../../lib/status";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 제목 왼쪽 달력. 박스를 두르면 카드가 되므로 구분은 옆 헤어라인이 맡는다. */
function DateMark({ date, accent }: { date: Date | null; accent: string }) {
    if (!date) {
        return (
            <div className="w-14 shrink-0 text-center">
                <div className="text-[11px] font-semibold tracking-wide text-zinc-400">일정</div>
                <div className="mt-0.5 text-xl leading-none font-bold text-zinc-400">미정</div>
            </div>
        );
    }

    return (
        <div className="w-14 shrink-0 text-center">
            <div className="text-[11px] font-semibold tracking-wide" style={{ color: accent }}>
                {date.getMonth() + 1}월
            </div>
            <div className="mt-0.5 text-[38px] leading-none font-bold tabular-nums">{date.getDate()}</div>
            <div className="mt-1 text-[11px] font-semibold text-zinc-400">{WEEKDAYS[date.getDay()]}</div>
        </div>
    );
}

/** 라벨을 값 위에 얹어 박스 없이 묶음을 만든다. */
function Fact({ label, value, align = "left" }: { label: string; value: ReactNode; align?: "left" | "right" }) {
    return (
        <div className={cn("min-w-0", align === "right" && "text-right")}>
            <div className="text-[11px] font-medium tracking-wide text-zinc-400">{label}</div>
            <div className="mt-0.5 text-[15px] font-semibold text-zinc-800 dark:text-zinc-100">{value}</div>
        </div>
    );
}

interface EventHeroProps {
    groupId: string;
    name: string;
    status: EventStatus;
    startAt?: Date | null;
    endAt?: Date | null;
    /** 확정 참가자 수 (EventMember where status=CONFIRMED) */
    memberCount: number;
    /** 참고용 목표 인원. 아무것도 막지 않는다. */
    minMember?: number | null;
    /** 회차 정원의 합. 컬럼이 아니라 파생값이라 쓰는 쪽이 계산해 넘긴다. */
    capacity?: number | null;
    /** 참여하기·수정 같은 버튼. 동작은 쓰는 쪽이 정한다. */
    action?: ReactNode;
}

export function EventHero({
    groupId,
    name,
    status,
    startAt,
    endAt,
    memberCount,
    minMember,
    capacity,
    action,
}: EventHeroProps) {
    const style = EVENT_STATUS[status];
    const { date, time } = formatPeriod(startAt, endAt);

    const reachedMin = Boolean(minMember && memberCount >= minMember);
    const isFull = Boolean(capacity && memberCount >= capacity);
    const hasCapacity = Boolean(minMember || capacity);

    // 시작일이 없으면 종료일이라도 달력에 세운다
    const anchorDate = startAt ?? endAt ?? null;
    const isRange = Boolean(endAt && (!startAt || !isSameDay(startAt, endAt)));

    return (
        <header className="pt-8">
            <a
                href={`/group/${groupId}/dashboard`}
                className="inline-flex items-center gap-0.5 text-[12px] text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
            >
                <ChevronLeft className="h-3.5 w-3.5" />
                이벤트 목록으로
            </a>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-5">
                {/* 좁은 화면에선 w-full로 action을 아래 줄로 밀어낸다 — 안 그러면 제목 폭을 뺏긴다 */}
                <div className="flex w-full min-w-0 items-stretch gap-4 sm:w-auto sm:flex-1 sm:gap-5">
                    <DateMark date={anchorDate} accent={style.accent} />
                    <div aria-hidden className="w-px shrink-0 bg-zinc-200 dark:bg-zinc-800" />

                    <div className="min-w-0 flex-1">
                        {/* 날짜는 왼쪽 달력이 말하므로 여기선 상태만 */}
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: style.accent }}>
                            <span
                                className={cn("h-1.5 w-1.5 rounded-full bg-current", style.live && "animate-pulse")}
                            />
                            {style.label}
                        </div>

                        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            {name}
                        </h1>
                    </div>
                </div>

                {action && <div className="shrink-0">{action}</div>}
            </div>

            {/* 위는 제목줄, 아래는 현황 */}
            <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800" />

            <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                {/* 달력이 못 담는 것만 — 여러 날이면 기간, 하루면 시간 */}
                {isRange ? <Fact label="기간" value={date} /> : time && <Fact label="시간" value={time} />}
                <Fact
                    label="참여"
                    align={isRange || time ? "right" : "left"}
                    value={
                        <span
                            className={cn(
                                "tabular-nums",
                                reachedMin && "text-emerald-700 dark:text-emerald-400",
                                isFull && "text-rose-600 dark:text-rose-400",
                            )}
                        >
                            {memberCount}
                            {capacity ? `/${capacity}` : ""}명
                            {reachedMin && !isFull && " · 최소 달성"}
                            {isFull && " · 정원 마감"}
                        </span>
                    }
                />
            </div>

            {/* 정원이 정해진 이벤트에만 게이지를 보여준다 */}
            {hasCapacity && (
                <>
                    <Gauge
                        value={memberCount}
                        max={capacity ?? minMember ?? 1}
                        color={isFull ? "#c13c35" : reachedMin ? "#016630" : undefined}
                        className="mt-3 h-1 dark:bg-zinc-800"
                        markers={
                            minMember && capacity
                                ? [
                                      {
                                          value: minMember,
                                          // 최소를 넘기면 마커가 채움 위로 올라가므로 대비를 뒤집는다
                                          color: reachedMin ? "rgba(255,255,255,0.8)" : "rgba(82,82,91,0.7)",
                                          label: `최소 모집인원 ${minMember}명`,
                                      },
                                  ]
                                : undefined
                        }
                        ariaLabel="정원 대비 현재 인원"
                    />
                    <div className="mt-1.5 flex justify-between text-[11px] font-medium text-zinc-400">
                        <span className={cn(reachedMin && "text-emerald-700 dark:text-emerald-400")}>
                            {minMember ? `최소 ${minMember}명` : ""}
                        </span>
                        <span className={cn(isFull && "text-rose-600 dark:text-rose-400")}>
                            {capacity ? `정원 ${capacity}명` : ""}
                        </span>
                    </div>
                </>
            )}
        </header>
    );
}
