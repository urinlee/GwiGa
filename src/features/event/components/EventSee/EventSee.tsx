import { useQuery } from "@tanstack/react-query";
import { EventHero } from "../EventHero/EventHero";
import { getEventById } from "@/services/event";
import { requireMember, requireUser } from "@/lib/api/guard";
import { EventActives } from "../EventActives/EventActives";

export async function EventSee({groupId, eventId}:{groupId:string, eventId:string}) {
    // const {data, isLoading, isError} = useQuery({
    //     queryKey:["event", eventId],
    //     queryFn:async ()=>{
    //         const res = await fetch(`/api/v1/group/${groupId}/event/${eventId}`)
    //         if (!res.ok) throw new Error("이벤트 조회 실패");
    //         return res.json();
    //     }
    // })
    const user = await requireUser()
    await requireMember(groupId, user.id)

    const data = await getEventById(groupId, eventId)

    return(
        <div>
            <EventHero groupId={groupId} name={data?.name || "찾을 수 없음"} description={data?.description} status={data?.status || "CLOSED"} startAt={data?.startAt} endAt={data?.endAt} memberCount={12}/>
            <div>
                <EventActives actives={[
                    {
                        name:"여름 정기 모임",
                        primaryColor:"#2563eb",
                        startAt:new Date(),
                        endAt:new Date(),
                        userCount:12,
                        userMaxCount:30
                    },
                    {
                        name:"여름 정기 모임",
                        primaryColor:"#16a34a",
                        startAt:new Date(),
                        endAt:new Date(),
                        userCount:12,
                        userMaxCount:30
                    }]}/>
            </div>
            
        </div>
    )
}