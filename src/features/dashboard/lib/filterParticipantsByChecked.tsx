
import { ParticipantsInfoCardProps } from "../components/ParticipateInfoCard/ParticipantsInfoCard";
import { stateType } from "../components/InfoCardsContainer/InfoCardsContainer";
import { getEnableStatus } from "./status";

type FilterParticipantsByStepArgs = {
    sortedParticipants: ParticipantsInfoCardProps[];
    getStepCheckedTags: (step: number) => stateType[];
};

export const filterParticipantsByStatus = ({sortedParticipants, getStepCheckedTags} : FilterParticipantsByStepArgs) => {
    return [...sortedParticipants].filter((participant) => {
        const participantStatuses = getEnableStatus(participant);
        const step1Statuses = getStepCheckedTags(1);
        const step2Statuses = getStepCheckedTags(2);

        // 1단계: 해당 Status가 아닌 것만 보임
        if (step1Statuses.some((status) => participantStatuses.map((value) => value.id).includes(status.id))) {
            return false;
        }

        // 2단계: 해당 Status만 보임
        if (step2Statuses.length > 0 && !step2Statuses.every((status) => participantStatuses.map((value) => value.id).includes(status.id))) {
            return false;
        }

        return true;
    });
}

//안되면 여기부터 확인할것
//위에꺼
export const countParticipantsByStatus = 
    (participants: ParticipantsInfoCardProps[], allStatuses: stateType[])
    : Record<string, number> => {

    const statusCounts: Record<string, number> = Object.fromEntries(
        allStatuses.map((status) => [
            status.id,
            participants.filter((participant) =>
                participant.userStatus.filter(value => value.isTrue).map((value) => value.id).includes(status.id)
            ).length,
        ])
    )
    return statusCounts;
}