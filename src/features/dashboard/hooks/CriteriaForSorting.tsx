import { useState } from "react";
import { ParticipantsInfoCardProps, ParticipateStatusProps } from "../components/ParticipateInfoCard/ParticipantsInfoCard";
import { getEnableStatus } from "../lib/status";
import { stateType } from "../components/InfoCardsContainer/InfoCardsContainer";

export const criteriaOptions = ["추천순", "끝낸 일 많은순", "끝낸 일 적은순", "이름순"] as const;

export type CriteriaForSorting = typeof criteriaOptions[number];

export function useCriteriaForSorting(participants: ParticipantsInfoCardProps[], allStatuses: stateType[]) {
    const [criteria, setCriteria] = useState<CriteriaForSorting>("추천순");
    // 각 참가자가 어떤 상태를 가지고 있는지 1/0 패턴으로 바꿔서 그룹 기준으로 사용함


    const recommendationArray = recommendationSorting(participants, allStatuses)

    const sortedParticipants = 
        criteria === "추천순" ? [...recommendationArray] :
        criteria === "끝낸 일 많은순" ? [...recommendationArray].sort((a, b) => getEnableStatus(b).length - getEnableStatus(a).length) :
        criteria === "끝낸 일 적은순" ? [...recommendationArray].sort((a, b) => getEnableStatus(a).length - getEnableStatus(b).length) :
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

export function recommendationSorting(participants: ParticipantsInfoCardProps[], allStatuses: stateType[]) {
    const getStatusPattern = (participant: ParticipantsInfoCardProps) => {
        const enabledSet = getEnableStatus(participant) // new Set(participant.enableStatus.map(String));
        const baseStatuses = allStatuses;
        return baseStatuses.map((eachStatus) => (enabledSet.find((enabledState) => (enabledState.id === eachStatus.id)) ? "1" : "0")).join("");
    };

    // 1) 상태 패턴, 2) 보유 상태 개수, 3) 이름 순으로 오름차순 정렬
    const sortedParticipants = [...participants].sort((a, b) => {
        const aPattern = getStatusPattern(a);
        const bPattern = getStatusPattern(b);

        if (aPattern !== bPattern) {
            return aPattern.localeCompare(bPattern);
        }

        if (getEnableStatus(a).length !== getEnableStatus(b).length) {
            return getEnableStatus(a).length - getEnableStatus(b).length;
        }

        return a.username.localeCompare(b.username, "ko");
    });
    return sortedParticipants;
}