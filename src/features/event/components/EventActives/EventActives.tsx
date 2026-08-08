"use client";
import { Gauge } from "@/components/ui/Gauge/Gauge";
import type { ActiveType } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import { formatPeriod } from "@/lib/date";
import { CalendarDays, ChevronDown, ClipboardList, CircleDot, Users, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

/** 액티브엔 status 컬럼이 없어서 기간으로 파생한다. */
export type ActivePhase = "예정" | "진행중" | "종료";

const PHASE_STYLE: Record<ActivePhase, string> = {
    예정: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    진행중: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    종료: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

const TYPE_META: Record<ActiveType, { label: string; Icon: LucideIcon }> = {
    MANUAL: { label: "일반", Icon: CircleDot },
    PAYMENT: { label: "결제", Icon: Wallet },
    SURVEY: { label: "설문", Icon: ClipboardList },
};

/** 시작 전이면 "예정", 종료 후면 "종료", 그 사이(기간 미정 포함)면 "진행중". */
export function deriveActivePhase(startAt?: Date | null, endAt?: Date | null, now: Date = new Date()): ActivePhase {
    if (endAt && now.getTime() > endAt.getTime()) return "종료";
    if (startAt && now.getTime() < startAt.getTime()) return "예정";
    return "진행중";
}

export interface EventActiveCardProps {
    name: string;
    primaryColor: string;
    description?: string | null;
    type?: ActiveType;
    startAt?: Date | null;
    endAt?: Date | null;
    userCount?: number;
    userMaxCount?: number;
    /** 기간으로 파생한 상태를 덮어쓸 때만 넘긴다. */
    phase?: ActivePhase;
    /** 펼쳤을 때 들어갈 내용(결제·설문 모듈 등). */
    children?: ReactNode;
}

export function EventActiveCard({
    name,
    primaryColor,
    description,
    type = "MANUAL",
    startAt,
    endAt,
    userCount,
    userMaxCount,
    phase,
    children,
}: EventActiveCardProps) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const detailId = useId();

    const { label: typeLabel, Icon: TypeIcon } = TYPE_META[type] ?? TYPE_META.MANUAL;
    const currentPhase = phase ?? deriveActivePhase(startAt, endAt);
    const { date, time } = formatPeriod(startAt, endAt);

    const count = userCount ?? 0;
    const isFull = Boolean(userMaxCount && count >= userMaxCount);

    return (
        <article
            className={cn(
                "group relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors",
                "hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700",
                // 종료된 액티브는 한 단계 물러나 보이게 한다
                currentPhase === "종료" && "opacity-70",
            )}
        >
            {/* 액티브 고유색 액센트 — 카드 모서리에 맞춰 잘리도록 overflow-hidden 안에 둔다 */}
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: primaryColor }} />

            <button
                type="button"
                onClick={() => setIsDetailOpen((open) => !open)}
                aria-expanded={isDetailOpen}
                aria-controls={detailId}
                className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4 pr-4 pl-6 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
                {/* min-w-0이 없으면 긴 이름이 오른쪽 메타를 밀어낸다 */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <TypeIcon size={18} style={{ color: primaryColor }} />
                    </span>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate font-bold">{name}</h3>
                            <span
                                className={cn(
                                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                    PHASE_STYLE[currentPhase],
                                )}
                            >
                                {currentPhase}
                            </span>
                            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                {typeLabel}
                            </span>
                        </div>
                        {description && (
                            <p className="mt-0.5 truncate text-[13px] text-zinc-500 dark:text-zinc-400">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays size={14} className="text-zinc-400" />
                            {date}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users size={14} className="text-zinc-400" />
                            <span
                                className={cn(
                                    "tabular-nums text-zinc-700 dark:text-zinc-200",
                                    isFull && "text-rose-600 dark:text-rose-400",
                                )}
                            >
                                {count}
                                {userMaxCount ? `/${userMaxCount}` : ""}명
                            </span>
                        </span>
                    </div>

                    <span
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 transition-transform duration-300 dark:border-zinc-700",
                            isDetailOpen && "rotate-180",
                        )}
                    >
                        <ChevronDown size={15} className="text-zinc-400" />
                    </span>
                </div>
            </button>

            {/* grid-rows 0fr→1fr 트릭: 내용 높이를 몰라도 펼침이 애니메이션된다 */}
            <div
                id={detailId}
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isDetailOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                {/* visibility를 함께 transition해야 접힌 동안 내부 요소가 탭 포커스를 먹지 않는다 */}
                <div
                    className={cn(
                        "overflow-hidden transition-[visibility] duration-300",
                        isDetailOpen ? "visible" : "invisible",
                    )}
                >
                    <div className="mr-4 mb-4 ml-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
                        {description && (
                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>
                        )}

                        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
                            <dt className="text-zinc-400">기간</dt>
                            <dd className="font-medium text-zinc-700 dark:text-zinc-200">
                                {date}
                                {time && ` · ${time}`}
                            </dd>
                            <dt className="text-zinc-400">참여</dt>
                            <dd className="font-medium text-zinc-700 tabular-nums dark:text-zinc-200">
                                {count}
                                {userMaxCount ? `/${userMaxCount}` : ""}명{isFull && " · 정원 마감"}
                            </dd>
                        </dl>

                        {/* 정원이 정해진 액티브에만 게이지를 보여준다 */}
                        {Boolean(userMaxCount) && (
                            <Gauge
                                value={count}
                                max={userMaxCount as number}
                                color={isFull ? "#c13c35" : primaryColor}
                                className="mt-3 h-1.5 dark:bg-zinc-700"
                                ariaLabel={`${name} 정원 대비 현재 인원`}
                            />
                        )}

                        {children}
                    </div>
                </div>
            </div>
        </article>
    );
}

export interface EventActivesProps {
    actives: (EventActiveCardProps & { id?: string })[];
    /** 섹션 제목. 기본 "액티브" */
    title?: string;
}

export function EventActives({ actives, title = "액티브" }: EventActivesProps) {
    return (
        // 바깥 여백은 쓰는 쪽이 정한다 (옆에 소개 레일이 붙는다)
        <section>
            <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-lg font-bold">{title}</h2>
                <span className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                    <span className="tabular-nums">{actives.length}</span>개
                </span>
            </div>

            {actives.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                    아직 등록된 액티브가 없어요
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {actives.map((active, index) => (
                        <li key={active.id ?? `${active.name}-${index}`}>
                            <EventActiveCard {...active} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
