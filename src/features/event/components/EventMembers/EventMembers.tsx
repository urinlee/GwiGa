'use client';
import InfoCardsContainer, { InfoCardsContainerProps } from "@/components/ui/InfoCardsContainer/InfoCardsContainer";
import { ParticipantsInfoCardProps } from "@/components/ui/InfoCardsContainer/types";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";
import { useState } from "react";




export function EventMemberCards({
    groupId,
    eventId,
    ...props
} : InfoCardsContainerProps & {groupId:string, eventId:string}) {

    const [clickInfoCard, setClickInfoCard] = useState<string|null>(null);
    

    const CardClickHandler = (memberId: string) => {
        console.log(`Card clicked for memberId: ${memberId}`);
        // 여기에 원하는 동작을 추가하세요. 예: 모달 열기, 페이지 이동 등.
    }

    const addEventMemberHandler = (memberId:string) => {
        setClickInfoCard(memberId);
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
            <AddEventMemberModal 
                groupId={groupId} 
                eventId={eventId} 
                isOpen={!!clickInfoCard} 
                handleOnClose={() => {setClickInfoCard(null)}}/>
        </div>
    )
}


export function AddEventMemberModal({ groupId, eventId, isOpen, handleOnClose }: { groupId:string; eventId:string; isOpen: boolean; handleOnClose: () => void }) {

    // 예: 모달 상태 관리, API 호출 등.
    return (
        <Modal isOpen={isOpen} onClose={handleOnClose}>
            <ModalContent>
                groupId: {groupId}, eventId: {eventId}
            </ModalContent>
        </Modal>
    )
}