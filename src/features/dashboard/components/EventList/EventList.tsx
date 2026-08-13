"use client"

import { EnterTextZone } from "@/components/ui/GetInput/EnterForm";
import { SegmentControl, SegmentOption } from "@/components/ui/SegmentControl/SegmentControl";
import { useState } from "react";
import { EventCard, StatusType } from "../EventCard/EventCard";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sumRecruitCapacity } from "@/features/event/lib/capacity";


const testEventCardArgs = {
    title: "여름 정기 모임",
    description: "한강에서 즐기는 여름 피크닉 모임입니다.",
    status: "진행중" as StatusType,
    primaryColor: "#2563eb",
    secondaryColor: "#294a7f",
    memberCount: 12,
    minMemberCount: 20,
    maxMemberCount: 40,
    dateTitle: "모임 날짜",
    date: new Date("2026-08-15T18:00:00"),
};

interface EventListProps {
    groupId:string;
}

const StatusOptions:SegmentOption[] = [
    {
        id:1,
        name:"모집중",
        status:"RECRUITING"
    },
    {
        id:2,
        name:"진행중",
        status:"ONGOING"
    },
    {
        id:3,
        name:"종료됨",
        status:"CLOSED"
    }
]

const StatusToKor: Record<string, StatusType> = {
    "RECRUITING":"모집중",
    "ONGOING":"진행중",
    "CLOSED":"종료됨"
}



export function EventList({groupId}:EventListProps) {

    const router = useRouter();

    const [selectEventStatus, setSelectEventStatus] = useState<SegmentOption>(StatusOptions[0])

    const {data, isLoading, isError} = useQuery({
        queryKey:["groupEvents", selectEventStatus],
        queryFn:async() => {
            const res = await fetch(`/api/v1/group/${groupId}/event?status=${selectEventStatus.status}`);
            if (!res.ok) throw new Error("이벤트 조회 실패");
            return res.json();
        }
    })

    
    return(
        <div className="flex flex-col gap-10">
            <div className="flex justify-between">
                <div className="">
                    <h1 className="text-2xl font-bold">이벤트</h1>
                    <p className="text-sm text-gray-500">이벤트 목록을 확인할 수 있습니다.</p>
                </div>
                <div>
                    <button className="bg-zinc-600 rounded-md py-[11px] px-[14px] text-white text-sm font-bold cursor-pointer" onClick={() => {router.push(`/group/${groupId}/event/new`)}}><span>+ 새 이벤트</span></button>
                </div>
            </div>
            <div className="flex justify-between">
                <div>
                    <SegmentControl options={StatusOptions} select={selectEventStatus} onChange={setSelectEventStatus}/>
                </div>
                <div>
                    <EnterTextZone/>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-3">
                {data?.map((event: any, index: number) => (
                    <div key={index} className="cursor-pointer" onClick={() => {router.push(`/group/${groupId}/event/${event.id}`)}}>
                        <EventCard
                            title={event.name}
                            description={event.description}
                            status={StatusToKor[event.status]}
                            primaryColor={"#2563eb"}
                            secondaryColor={"#294a7f"}
                            memberCount={event.recruits.reduce((acc: number, recruit: any) => acc + recruit._count.applicants, 0)}
                            minMemberCount={event.minMember ?? undefined}
                            maxMemberCount={sumRecruitCapacity(event.recruits) ?? undefined}
                            dateTitle={"test"}
                            date={new Date(event.startAt)}
                        />
                    </div>


                ))}

                {/* <EventCard {...testEventCardArgs}/> */}
            </div>
        </div>
    )
}