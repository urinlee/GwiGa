import type { ParticipantsInfoCardProps, stateType } from "../types";

export function getEnableStatus(participant:ParticipantsInfoCardProps) {
    return participant.userStatus.filter((status) => status.isTrue)
}

export function getStatusbyId(allStatus:stateType[], statusId:string){
    return ( allStatus.find((state)=>state.id === statusId) )
}