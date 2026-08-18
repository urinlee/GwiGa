/**
 * 컨테이너·카드·훅·lib이 함께 쓰는 타입.
 * 컴포넌트 파일에 두면 훅이 컴포넌트를 import하고 컴포넌트가 훅을 import하는 순환이 된다.
 */

/** 있을 수 있는 상태 전부. 참가자가 가진 것만이 아니라 필터·정렬의 기준이 되는 목록이다. */
export interface stateType {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
}

/** 한 참가자가 가진 상태 하나. isTrue가 끝냈는지 여부. */
export interface ParticipateStatusProps extends stateType {
    isTrue: boolean;
}

export interface ParticipantsInfoCardProps {
    /** GroupMember의 id. 이름은 겹칠 수 있어 사람을 특정할 때는 이걸 쓴다. */
    memberId: string;
    username: string;
    avatarUrl?: string;
    userStatus: ParticipateStatusProps[];
    onClick?: (memberId: string) => void;
}
