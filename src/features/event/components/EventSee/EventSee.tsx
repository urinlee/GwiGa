import { EventHero } from "../EventHero/EventHero";
import { getEventById } from "@/services/event";
import { requireMember, requireUser } from "@/lib/api/guard";
import { EventActives } from "../EventActives/EventActives";
import { EventAbout } from "../EventAbout/EventAbout";

export async function EventSee({groupId, eventId}:{groupId:string, eventId:string}) {
    const user = await requireUser()
    await requireMember(groupId, user.id)

    const data = await getEventById(groupId, eventId)

    return(
        <div className="pb-16">
            <EventHero groupId={groupId} name={data?.name || "찾을 수 없음"} status={data?.status || "CLOSED"} startAt={data?.startAt} endAt={data?.endAt} memberCount={12}/>

            {/* 왼쪽은 할 일(액티브), 오른쪽은 참고(소개) */}
            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
                <div className="min-w-0 flex-1">
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

                <EventAbout
                    description={data?.description}
                    className="border-t border-zinc-200 pt-6 lg:w-64 lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 dark:border-zinc-800"
                />
            </div>
        </div>
    )
}
