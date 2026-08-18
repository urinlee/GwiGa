'use client';
import InfoCardsContainer, { InfoCardsContainerProps } from "@/components/ui/InfoCardsContainer/InfoCardsContainer";
import { ParticipantsInfoCardProps } from "@/components/ui/InfoCardsContainer/types";
import { useState } from "react";


export function EventMemberCards({
    ...props
} : InfoCardsContainerProps) {

    const [clickInfoCard, setClickInfoCard] = useState(null);
    

    const CardClickHandler = (memberId: string) => {
        console.log(`Card clicked for memberId: ${memberId}`);
        // 여기에 원하는 동작을 추가하세요. 예: 모달 열기, 페이지 이동 등.
    }

    const addEventMemberHandler = (memberId:string) => {
        console.log("참가자 추가 클릭");
        // 여기에 참가자 추가 동작을 구현하세요. 예: 모달 열기, 페이지 이동 등.
    }

    const participants : ParticipantsInfoCardProps[] = [...props.participants.map((participant) => ({
        ...participant,
        onClick: CardClickHandler
    })), {memberId: "add", username: "참가자 추가", avatarUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBsdXMtaWNvbiBsdWNpZGUtcGx1cyI+PHBhdGggZD0iTTUgMTJoMTQiLz48cGF0aCBkPSJNMTIgNXYxNCIvPjwvc3ZnPg==", userStatus: [], onClick: addEventMemberHandler}];

    return (
        <div>
            <div className="mb-5 flex justify-between items-center">
                <h1 className="text-lg font-bold">참가자</h1>
            </div>
            <InfoCardsContainer
                participants={participants}
                allStatuses={props.allStatuses}
                emptyMessage="아직 이 이벤트에 참가한 사람이 없어요"
            />
        </div>
    )
}


export function addEventMemberModal({ groupId, eventId }: { groupId: string; eventId: string }) {
    // 여기에 참가자 추가 모달 로직을 구현하세요.
    console.log(`참가자 추가 모달 열기: groupId=${groupId}, eventId=${eventId}`);
    // 예: 모달 상태 관리, API 호출 등.
}