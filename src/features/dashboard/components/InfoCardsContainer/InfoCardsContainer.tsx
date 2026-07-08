'use client';
import { useMemo } from "react";
import ParticipantInfoCard, { ParticipantsInfoCardProps, ParticipateStatusProps } from "../ParticipateInfoCard/ParticipantsInfoCard";
import { cn } from "@/lib/cn";
import useDividedByCheckedTag from "@/features/dashboard/hooks/DividedByCheckedTag";
import { CriteriaForSorting, criteriaOptions, useCriteriaForSorting } from "../../hooks/CriteriaForSorting";
import { filterParticipantsByStatus, countParticipantsByStatus } from "../../lib/filterParticipantsByChecked";
import { getStatusbyId } from "../../lib/status";

export interface stateType {
    id:string
    name:string
    primaryColor:string
    secondaryColor:string
  }

export interface InfoCardsContainerProps {
    participants: ParticipantsInfoCardProps[];
    allStatuses: stateType[];
}

export default function InfoCardsContainer({ participants, allStatuses }: InfoCardsContainerProps) {
    // // 전체 참가자 기준으로 상태 순서를 하나 정해두고, 그 순서대로 비교
    // const statusOrder = Array.from(
    //     new Set(participants.flatMap((participant) => participant.allStatus.map(String)))
    // ).sort((a, b) => a.localeCompare(b, "ko"));

    const { criteria, setCriteria, sortedParticipants } = useCriteriaForSorting(participants, allStatuses);
    const {CheckedTagsStep, toggleTagClick, getStepCheckedTags,} = useDividedByCheckedTag(allStatuses);
    // 0: 참조하지 안음
    // 1: 해당 Status가 아닌 것만 보임
    // 2: 해당 Status만 보임

    const filteredParticipants = filterParticipantsByStatus({sortedParticipants, getStepCheckedTags});
    const StatusParticipantCount = countParticipantsByStatus(filteredParticipants, allStatuses);


    return (
        <div>
            <div className="flex justify-between items-center mb-4 px-2 w-full">
                <div className="hidden md:flex items-center gap-4">
                    <span className={cn("text-[15px] font-bold text-zinc-500 dark:text-zinc-400")}>전체: {filteredParticipants.length}/{participants.length}명</span>
                    {Object.entries(CheckedTagsStep).map(([statusId, num], _) => {
                        const state = getStatusbyId(allStatuses, statusId)
                        return(
                            <div key={statusId} className="flex items-center gap-1 cursor-pointer select-none" onClick={()=>toggleTagClick(statusId)}>
                                <div className={cn("w-2 h-2 rounded-full", num == 1 ? "bg-orange-500" : num == 2 ? "bg-green-500" : num==0 && "bg-gray-300 dark:bg-gray-700")} />
                                <span className={cn("text-sm font-bold text-zinc-500 dark:text-zinc-400")} style={{ color: state?.primaryColor }}>
                                {/* 색상 participateStatusClasses에 맞게 바꾸기 */}
                                    {state?.name} ({StatusParticipantCount[statusId] ?? 0}/{participants.length})
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* 데스크탑용 sort 옵션 */}
                <div className="hidden md:block">
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
                <div className="md:hidden">
                    <select 
                        value={criteria} 
                        onChange={(e) => setCriteria(e.target.value as CriteriaForSorting)}
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
            <div className="flex flex-col md:grid md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
                {
                filteredParticipants.map((participant) => (
                    <div key={participant.username} className={cn("w-full", )}>
                        <ParticipantInfoCard {...participant} />
                    </div>
                ))
                }
            </div>
        </div>
    );
}

