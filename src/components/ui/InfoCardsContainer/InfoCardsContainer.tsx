'use client';
import type { ReactNode } from "react";
import ParticipantInfoCard from "./ParticipantsInfoCard";
import { cn } from "@/lib/cn";
import useDividedByCheckedTag from "./hooks/DividedByCheckedTag";
import { CriteriaForSorting, criteriaOptions, useCriteriaForSorting } from "./hooks/CriteriaForSorting";
import { filterParticipantsByStatus, countParticipantsByStatus } from "./lib/filterParticipantsByChecked";
import { getStatusbyId } from "./lib/status";
import type { ParticipantsInfoCardProps, stateType } from "./types";

export type { stateType, ParticipantsInfoCardProps, ParticipateStatusProps } from "./types";

export interface InfoCardsContainerProps {
    participants: ParticipantsInfoCardProps[];
    /** 필터·정렬의 기준이 되는 상태 전부. 아무도 안 가진 상태도 넣으면 0명으로 보인다. */
    allStatuses: stateType[];
    /** 섹션 제목. 안 주면 제목줄 자체가 없다 (대시보드처럼 목록만 필요할 때). */
    title?: string;
    /** 제목 오른쪽에 붙는 버튼 자리. title이 있을 때만 그려진다. */
    action?: ReactNode;
    /** 참가자가 하나도 없을 때 보여줄 문구. */
    emptyMessage?: string;
    /** 바깥 여백·구분선은 쓰는 쪽이 정한다. */
    className?: string;
}

export default function InfoCardsContainer({
    participants,
    allStatuses,
    title,
    action,
    emptyMessage = "아직 참가자가 없어요",
    className,
}: InfoCardsContainerProps) {
    const { criteria, setCriteria, sortedParticipants } = useCriteriaForSorting(participants, allStatuses);
    const { getTagStep, toggleTagClick, getStepCheckedTags } = useDividedByCheckedTag(allStatuses);
    // 0: 참조하지 안음
    // 1: 해당 Status가 아닌 것만 보임
    // 2: 해당 Status만 보임

    const filteredParticipants = filterParticipantsByStatus({ sortedParticipants, getStepCheckedTags });
    const StatusParticipantCount = countParticipantsByStatus(filteredParticipants, allStatuses);

    return (
        <section className={className}>
            {title && (
                <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h2 className="text-lg font-bold">{title}</h2>
                    {action}
                </div>
            )}

            <div className="mb-4 flex w-full items-center justify-between gap-4 px-2">
                {/* 몇 명 중 몇 명인지는 화면 폭과 상관없이 필요하다. 상태 토글만 넓은 화면에 둔다. */}
                <div className="flex min-w-0 items-center gap-4">
                    <span className="shrink-0 text-[15px] font-bold text-zinc-500 dark:text-zinc-400">
                        전체: <span className="tabular-nums">{filteredParticipants.length}/{participants.length}</span>명
                    </span>
                    <div className="hidden items-center gap-4 md:flex">
                        {allStatuses.map((status) => {
                            const step = getTagStep(status.id);
                            const state = getStatusbyId(allStatuses, status.id);
                            return (
                                <button
                                    key={status.id}
                                    type="button"
                                    onClick={() => toggleTagClick(status.id)}
                                    aria-pressed={step !== 0}
                                    className="flex cursor-pointer items-center gap-1 select-none rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                                >
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "h-2 w-2 rounded-full",
                                            step === 1
                                                ? "bg-orange-500"
                                                : step === 2
                                                  ? "bg-green-500"
                                                  : "bg-gray-300 dark:bg-gray-700",
                                        )}
                                    />
                                    <span
                                        className="text-sm font-bold text-zinc-500 dark:text-zinc-400"
                                        style={{ color: state?.primaryColor }}
                                    >
                                        {/* 색상 participateStatusClasses에 맞게 바꾸기 */}
                                        {state?.name} ({StatusParticipantCount[status.id] ?? 0}/{participants.length})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 데스크탑용 sort 옵션 */}
                <div className="hidden shrink-0 md:block">
                    {criteriaOptions.map((option) => (
                        <span
                            key={option}
                            onClick={() => setCriteria(option as CriteriaForSorting)}
                            className={cn("cursor-pointer text-[10px] mx-1 font-bold text-zinc-500 dark:text-zinc-400", criteria === option ? "border-b-2 border-sky-200 dark:border-indigo-600" : "")}>
                                {option}
                        </span>
                    ))}
                </div>

                {/* 모바일용 sort 옵션 */}
                <div className="shrink-0 md:hidden">
                    <select
                        value={criteria}
                        onChange={(e) => setCriteria(e.target.value as CriteriaForSorting)}
                        aria-label="정렬 기준"
                        className="text-sm text-zinc-500 dark:text-zinc-400 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
                    >
                        {criteriaOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {participants.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                    {emptyMessage}
                </div>
            ) : (
                <div className="flex flex-col md:grid md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
                    {
                    filteredParticipants.map((participant) => (
                        <div key={participant.username} className={cn("w-full", )}>
                            <ParticipantInfoCard {...participant} />
                        </div>
                    ))
                    }
                </div>
            )}
        </section>
    );
}
