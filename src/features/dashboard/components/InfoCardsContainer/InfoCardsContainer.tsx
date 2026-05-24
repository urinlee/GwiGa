'use client';
import ParticipantInfoCard, { ParticipantsInfoCardProps } from "../ParticipateInfoCard/ParticipantsInfoCard";
import { cn } from "@/lib/cn";
import useDividedByCheckedTag from "@/features/dashboard/hooks/DividedByCheckedTag";
import { CriteriaForSorting, criteriaOptions, useCriteriaForSorting } from "../../hooks/CriteriaForSorting";
import { participateStatusClasses } from "@/types/status";
import { filteredParticipantsByStep } from "../../lib/filterParticipantsByChecked";


export interface InfoCardsContainerProps {
    participants: ParticipantsInfoCardProps[];
}

export default function InfoCardsContainer({ participants }: InfoCardsContainerProps) {
    // // 전체 참가자 기준으로 상태 순서를 하나 정해두고, 그 순서대로 비교
    // const statusOrder = Array.from(
    //     new Set(participants.flatMap((participant) => participant.allStatus.map(String)))
    // ).sort((a, b) => a.localeCompare(b, "ko"));

    const getAllStatuses = [...Array.from(new Set(participants.flatMap((participant) => participant.allStatus.map(String))))] as const;

    const { criteria, setCriteria, sortedParticipants } = useCriteriaForSorting(participants);
    const {CheckedTagsStep, toggleTagClick, getStepCheckedTags,} = useDividedByCheckedTag(getAllStatuses);
    // 0: 참조하지 안음
    // 1: 해당 Status가 아닌 것만 보임
    // 2: 해당 Status만 보임

    const filteredParticipants = filteredParticipantsByStep({sortedParticipants, getStepCheckedTags});

    return (
        <div>
            <div className="flex justify-between items-center mb-4 px-5 w-full">
                <div className="flex gap-4">
                    {Object.entries(CheckedTagsStep).map(([status, num], index) => (
                        <div key={status + index.toString()} className="flex items-center gap-1 cursor-pointer select-none" onClick={()=>toggleTagClick(status)}>
                            <div className={cn("w-2 h-2 rounded-full", num == 1 ? "bg-orange-500" : num == 2 ? "bg-green-500" : num==0 && "bg-gray-300 dark:bg-gray-700")} />
                            <span key={status + index.toString()} className={cn("text-sm font-bold text-zinc-500 dark:text-zinc-400", participateStatusClasses[status as keyof typeof participateStatusClasses] ?? "")}>
                            {/* 색상 participateStatusClasses에 맞게 바꾸기 */}
                                {status}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="">
                    {criteriaOptions.map((option) => (
                        <span 
                            key={option} 
                            onClick={() => setCriteria(option as CriteriaForSorting)}
                            className={cn("cursor-pointer text-[10px] mx-1 font-bold text-zinc-500 dark:text-zinc-400", criteria === option ? "border-b-2 border-sky-200 dark:border-indigo-600" : "")}>
                                {option}
                        </span>
                    ))}
                </div>
                
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
                {
                filteredParticipants.map((participant, index) => (
                    <div key={participant.username + '-' + index.toString()} className={cn("w-full", )}>
                        <ParticipantInfoCard {...participant} />
                    </div>
                ))
                }
            </div>
        </div>
    );
}

