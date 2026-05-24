
import { ParticipantsInfoCardProps } from "../components/ParticipateInfoCard/ParticipantsInfoCard";

type FilterParticipantsByStepArgs = {
    sortedParticipants: ParticipantsInfoCardProps[];
    getStepCheckedTags: (step: number) => string[];
};

export const filteredParticipantsByStep = ({sortedParticipants, getStepCheckedTags} : FilterParticipantsByStepArgs) => {
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