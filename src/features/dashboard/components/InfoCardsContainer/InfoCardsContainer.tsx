//TODO: 요거 만들기

import ParticipantInfoCard, { ParticipantsInfoCardProps } from "../ParticipateInfoCard/ParticipantsInfoCard";


export interface InfoCardsContainerProps {
    participants: ParticipantsInfoCardProps[];
}

export default function InfoCardsContainer({ participants }: InfoCardsContainerProps) {
    // // 전체 참가자 기준으로 상태 순서를 하나 정해두고, 그 순서대로 비교
    // const statusOrder = Array.from(
    //     new Set(participants.flatMap((participant) => participant.allStatus.map(String)))
    // ).sort((a, b) => a.localeCompare(b, "ko"));

    // 각 참가자가 어떤 상태를 가지고 있는지 1/0 패턴으로 바꿔서 그룹 기준으로 사용함
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

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
            {sortedParticipants.map((participant, index) => (
                <ParticipantInfoCard key={participant.username + index.toString()} {...participant} />
            ))}
        </div>
    );
}

