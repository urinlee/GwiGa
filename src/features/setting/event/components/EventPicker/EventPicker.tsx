import type { CSSProperties } from "react";
import type { EventStatus } from "@/generated/prisma/enums";
import { Gauge } from "@/components/ui/Gauge/Gauge";
import { EVENT_STATUS } from "@/features/event/lib/status";
import { cn } from "@/lib/cn";
import { daysUntil, formatPeriod, formatShortPeriod, isSameDay } from "@/lib/date";
import { CalendarPlus, ChevronRight } from "lucide-react";
import Link from "next/link";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export interface EventPickItem {
    id: string;
    name: string;
    status: EventStatus;
    startAt: Date | null;
    endAt: Date | null;
    /** 모든 회차의 신청자 합 */
    applicantCount: number;
    /** 회차 정원의 합. 한 회차라도 무제한이면 null */
    capacity: number | null;
    recruitCount: number;
}

/** 일정 없는 이벤트는 언제인지 모르니 묶음 끝으로 민다. */
function anchorTime(event: EventPickItem): number | null {
    return (event.startAt ?? event.endAt)?.getTime() ?? null;
}

function sortByDate(events: EventPickItem[], direction: 1 | -1): EventPickItem[] {
    return [...events].sort((a, b) => {
        const x = anchorTime(a);
        const y = anchorTime(b);
        if (x === null || y === null) return x === null ? 1 : -1;
        return (x - y) * direction;
    });
}

/** 아직 시작 안 한 이벤트만 남은 날을 말한다. 이미 시작했으면 상태 라벨이 그 일을 한다. */
function countdown(event: EventPickItem, now: Date): string | null {
    if (!EVENT_STATUS[event.status].live || !event.startAt) return null;
    const days = daysUntil(event.startAt, now);
    if (days < 0) return null;
    if (days === 0) return "오늘";
    if (days === 1) return "내일";
    return `${days}일 뒤`;
}

/** 강조 행은 왼쪽 기둥이 날짜를 말하니 기둥이 못 담는 것만 쓴다. 여러 날이면 기간, 하루면 시간. */
function detailPeriod(event: EventPickItem): string | null {
    const { date, time } = formatPeriod(event.startAt, event.endAt);
    const isRange = Boolean(event.endAt && (!event.startAt || !isSameDay(event.startAt, event.endAt)));
    return isRange ? date : (time ?? null);
}

/** 왼쪽 날짜 기둥. EventHero와 같은 형태라 목록에서 상세로 넘어가도 눈이 이어진다. */
function DateMark({ date, featured }: { date: Date | null; featured?: boolean }) {
    // 폭은 강조 행도 같다. 날짜가 목록의 척추라 칸이 어긋나면 바로 보인다.
    const side = "w-16";
    const caption = featured ? "text-[12px]" : "text-[11px]";

    if (!date) {
        return (
            <div className={cn(side, "shrink-0 text-center text-zinc-600 dark:text-zinc-400")}>
                <div className={cn(caption, "font-semibold")}>일정</div>
                <div className={cn(featured ? "text-[26px]" : "text-[18px]", "leading-tight font-bold")}>미정</div>
            </div>
        );
    }

    return (
        <div className={cn(side, "shrink-0 text-center")}>
            <div className={cn(caption, "font-semibold text-zinc-600 dark:text-zinc-400")}>{date.getMonth() + 1}월</div>
            <div
                className={cn(
                    featured ? "text-[44px]" : "text-[30px]",
                    "leading-none font-bold tabular-nums text-zinc-900 dark:text-zinc-100",
                )}
            >
                {date.getDate()}
            </div>
            <div className={cn(caption, "mt-1 font-semibold text-zinc-600 dark:text-zinc-400")}>
                {WEEKDAYS[date.getDay()]}
            </div>
        </div>
    );
}

function EventRow({
    groupId,
    event,
    now,
    featured,
}: {
    groupId: string;
    event: EventPickItem;
    now: Date;
    featured?: boolean;
}) {
    const { label, accent } = EVENT_STATUS[event.status];
    const applied = `${event.applicantCount}${event.capacity ? `/${event.capacity}` : ""}명`;
    const remaining = countdown(event, now);

    return (
        <li
            // 상태색을 변수로 내려 세로 막대·테두리·바탕이 한 값을 나눠 쓴다.
            style={
                {
                    "--accent": accent,
                    "--edge": `${accent}33`,
                    "--tint": `${accent}14`,
                    "--tint-hover": `${accent}22`,
                    "--tint-dark": `${accent}2e`,
                    "--tint-dark-hover": `${accent}42`,
                } as CSSProperties
            }
        >
            <Link
                href={`/setting/event/${encodeURIComponent(groupId)}/${encodeURIComponent(event.id)}`}
                className={cn(
                    "group flex flex-col rounded-2xl px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100",
                    featured
                        ? "relative bg-[var(--tint)] py-5 hover:bg-[var(--tint-hover)] dark:bg-[var(--tint-dark)] dark:hover:bg-[var(--tint-dark-hover)]"
                        : "py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                )}
            >
                {/* 지금 돌아가는 이벤트만 테두리가 돈다. 시작 전이면 서 있는다. */}
                {featured && (
                    <span
                        aria-hidden
                        data-live={event.status === "ONGOING"}
                        className="trace-ring pointer-events-none absolute inset-0 rounded-2xl"
                    />
                )}
                <div className={cn("flex items-center", featured ? "gap-4 sm:gap-6" : "gap-4 sm:gap-5")}>
                    <DateMark date={event.startAt ?? event.endAt} featured={featured} />

                    {/* 상태를 점이 아니라 기둥으로 세운다. 글자에 쓰면 초록이 AA에 못 미친다. */}
                    <div
                        aria-hidden
                        className={cn(
                            "shrink-0 rounded-full bg-[var(--accent)]",
                            featured ? "h-16 w-[5px]" : "h-11 w-[3px]",
                        )}
                    />

                    <div className="min-w-0 flex-1">
                        <div
                            className={cn(
                                "font-semibold text-zinc-700 dark:text-zinc-300",
                                featured ? "text-[13px]" : "text-[12px]",
                            )}
                        >
                            {label}
                        </div>

                        <h3
                            className={cn(
                                "mt-0.5 truncate font-bold tracking-tight text-zinc-900 dark:text-zinc-100",
                                featured ? "text-[22px]" : "text-[16px] font-semibold",
                            )}
                        >
                            {event.name}
                        </h3>

                        {/* 가운뎃점 대신 라벨로 나눈다. 좁아지면 그냥 줄바꿈된다. */}
                        <div
                            className={cn(
                                "mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-zinc-600 dark:text-zinc-400",
                                featured ? "text-[13px]" : "text-[12px]",
                            )}
                        >
                            {/* 좁은 화면엔 오른쪽 칸이 없다. 남은 날이 시각보다 먼저다. */}
                            {remaining && (
                                <span className="font-bold text-zinc-900 sm:hidden dark:text-zinc-100">
                                    {remaining}
                                </span>
                            )}
                            {/* 날짜가 아예 없으면 왼쪽 기둥이 "미정"이라 말한다. 두 번 쓰지 않는다. */}
                            {(event.startAt || event.endAt) && (
                                <span className={cn("tabular-nums", remaining && "hidden sm:inline")}>
                                    {featured
                                        ? (detailPeriod(event) ?? formatShortPeriod(event.startAt, event.endAt))
                                        : formatShortPeriod(event.startAt, event.endAt)}
                                </span>
                            )}
                            <span className="tabular-nums sm:hidden">신청 {applied}</span>
                            <span>{event.recruitCount ? `회차 ${event.recruitCount}개` : "회차 없음"}</span>
                        </div>
                    </div>

                    {/* 관리자가 훑는 두 값(언제·몇 명)을 한 칸에 모아 세로로 맞춘다 */}
                    <div className="hidden w-24 shrink-0 text-right sm:block">
                        {remaining ? (
                            <>
                                <div
                                    className={cn(
                                        "font-bold text-zinc-900 dark:text-zinc-100",
                                        featured ? "text-[17px]" : "text-[14px]",
                                    )}
                                >
                                    {remaining}
                                </div>
                                <div className="mt-0.5 text-[12px] tabular-nums text-zinc-600 dark:text-zinc-400">
                                    신청 {applied}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">신청</div>
                                <div
                                    className={cn(
                                        "mt-0.5 font-semibold tabular-nums text-zinc-900 dark:text-zinc-100",
                                        featured ? "text-[17px]" : "text-[15px]",
                                    )}
                                >
                                    {applied}
                                </div>
                            </>
                        )}

                        {/* 숫자 바로 아래 짧게. 행 전체를 가르면 이름보다 세진다. */}
                        {featured && event.capacity ? (
                            <Gauge
                                value={event.applicantCount}
                                max={event.capacity}
                                color={accent}
                                className="mt-2 h-1 bg-zinc-900/10 dark:bg-white/15"
                                ariaLabel="정원 대비 신청 인원"
                            />
                        ) : null}
                    </div>

                    <ChevronRight
                        aria-hidden
                        className="size-4 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5 dark:text-zinc-400"
                    />
                </div>
            </Link>
        </li>
    );
}

function EventGroup({
    title,
    groupId,
    events,
    now,
    featureFirst,
}: {
    title: string;
    groupId: string;
    events: EventPickItem[];
    now: Date;
    featureFirst?: boolean;
}) {
    if (events.length === 0) return null;

    const [head, ...rest] = events;

    return (
        <section>
            <h2 className="flex items-baseline gap-2.5 px-3 text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {title}
                <span className="text-[12px] font-semibold tabular-nums text-zinc-600 dark:text-zinc-400">
                    {events.length}개
                </span>
            </h2>

            {featureFirst ? (
                <>
                    {/* 크게 세운 하나와 흘리는 나머지는 성격이 달라 목록을 나눈다 */}
                    <ul className="mt-3">
                        <EventRow groupId={groupId} event={head} now={now} featured />
                    </ul>
                    {rest.length > 0 && (
                        <ul className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800/70">
                            {rest.map((event) => (
                                <EventRow key={event.id} groupId={groupId} event={event} now={now} />
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <ul className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800/70">
                    {events.map((event) => (
                        <EventRow key={event.id} groupId={groupId} event={event} now={now} />
                    ))}
                </ul>
            )}
        </section>
    );
}

function EmptyState({ groupId }: { groupId: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-700">
            <p className="text-[17px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                아직 이벤트가 없어요
            </p>
            <p className="mt-1.5 text-[13px] text-zinc-600 dark:text-zinc-400">
                이벤트를 만들면 회차와 신청을 여기서 관리할 수 있어요
            </p>
            <Link
                href={`/group/${encodeURIComponent(groupId)}/event/new`}
                className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-zinc-900 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
            >
                <CalendarPlus size={15} strokeWidth={2.25} />새 이벤트 만들기
            </Link>
        </div>
    );
}

/** 설정할 이벤트를 고르는 목록. 가장 가까운 살아있는 이벤트 하나를 크게 세우고 나머지는 행으로 흘린다. */
export function EventPicker({ groupId, events }: { groupId: string; events: EventPickItem[] }) {
    if (events.length === 0) return <EmptyState groupId={groupId} />;

    // 행마다 new Date()를 부르면 기준이 어긋난다. 한 번 찍어 내려보낸다.
    const now = new Date();
    // 진행 중인 건 가까운 날짜부터, 지난 건 최근 것부터가 찾는 순서와 맞는다.
    const live = sortByDate(events.filter((event) => EVENT_STATUS[event.status].live), 1);
    const past = sortByDate(events.filter((event) => !EVENT_STATUS[event.status].live), -1);

    return (
        <div className="flex flex-col gap-10">
            <EventGroup title="진행 중인 이벤트" groupId={groupId} events={live} now={now} featureFirst />
            <EventGroup title="지난 이벤트" groupId={groupId} events={past} now={now} />
        </div>
    );
}
