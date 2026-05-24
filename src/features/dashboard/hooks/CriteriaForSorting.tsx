import { useState } from "react";
import { ParticipantsInfoCardProps } from "../components/ParticipateInfoCard/ParticipantsInfoCard";

export const criteriaOptions = ["추천순", "끝낸 일 많은순", "끝낸 일 적은순", "이름순"] as const;

export type CriteriaForSorting = typeof criteriaOptions[number];

export function useCriteriaForSorting(participants: ParticipantsInfoCardProps[]) {
    const [criteria, setCriteria] = useState<CriteriaForSorting>("추천순");
    // 각 참가자가 어떤 상태를 가지고 있는지 1/0 패턴으로 바꿔서 그룹 기준으로 사용함

    const sortedParticipants = 
        criteria === "추천순" ? recommendationSorting(participants) :
        criteria === "끝낸 일 많은순" ? recommendationSorting(participants).sort((a, b) => b.enableStatus.length - a.enableStatus.length) :
        criteria === "끝낸 일 적은순" ? recommendationSorting(participants).sort((a, b) => a.enableStatus.length - b.enableStatus.length) :
        criteria === "이름순" ? [...participants].sort((a, b) => a.username.localeCompare(b.username, "ko", {
            numeric: true,
        })) :
        participants;

    return {
        criteria,
        setCriteria,
        sortedParticipants,
    }
}

export function recommendationSorting(participants: ParticipantsInfoCardProps[]) {
    const getStatusPattern = (participant: ParticipantsInfoCardProps) => {
        const enabledSet = new Set(participant.enableStatus.map(String));
        const baseStatuses = participants[0]?.allStatus ?? [];
        return baseStatuses.map((status) => (enabledSet.has(status.toString()) ? "1" : "0")).join("");
    };

    // 1) 상태 패턴, 2) 보유 상태 개수, 3) 이름 순으로 오름차순 정렬
    const sortedParticipants = [...participants].sort((a, b) => {
        const aPattern = getStatusPattern(a);
        const bPattern = getStatusPattern(b);

        if (aPattern !== bPattern) {
            return aPattern.localeCompare(bPattern);
        }

        if (a.enableStatus.length !== b.enableStatus.length) {
            return a.enableStatus.length - b.enableStatus.length;
        }

        return a.username.localeCompare(b.username, "ko");
    });
    return sortedParticipants;
}