
import { participateContentStatus } from "@/types/status";
import { ParticipantsInfoCardProps } from "../components/ParticipateInfoCard/ParticipantsInfoCard";

type FilterParticipantsByStepArgs = {
    sortedParticipants: ParticipantsInfoCardProps[];
    getStepCheckedTags: (step: number) => string[];
};

export const filterParticipantsByStatus = ({sortedParticipants, getStepCheckedTags} : FilterParticipantsByStepArgs) => {
    return [...sortedParticipants].filter((participant) => {
        const participantStatuses = new Set(participant.enableStatus.map(String));
        const step1Statuses = getStepCheckedTags(1);
        const step2Statuses = getStepCheckedTags(2);

        // 1단계: 해당 Status가 아닌 것만 보임
        if (step1Statuses.some((status) => participantStatuses.has(status))) {
            return false;
        }

        // 2단계: 해당 Status만 보임
        if (step2Statuses.length > 0 && !step2Statuses.every((status) => participantStatuses.has(status))) {
            return false;
        }

        return true;
    });
}

export const countParticipantsByStatus = 
    (participants: ParticipantsInfoCardProps[], allStatuses: readonly participateContentStatus[])
    : Record<participateContentStatus, number> => {

    const statusCounts: Record<participateContentStatus, number> = Object.fromEntries(
        allStatuses.map((status) => [
            status,
            participants.filter((participant) =>
                participant.enableStatus.map(String).includes(status)
            ).length,
        ])
    ) as Record<participateContentStatus, number>;
    return statusCounts;
}