import { EventHero } from "../EventHero/EventHero";
import { getEventById } from "@/services/event";
import { verifyMember } from "@/lib/dal";
import { EventActives } from "../EventActives/EventActives";
import { EventAbout } from "../EventAbout/EventAbout";
import { getActives } from "@/services/active";
import { AddActiveButton } from "../AddActiveButton/AddActiveButton";

export async function EventSee({groupId, eventId}:{groupId:string, eventId:string}) {
    await verifyMember(groupId)

    const data = await getEventById(groupId, eventId)
    const actives = await getActives(groupId, eventId)
    const activesData = actives.map((active:any) => ({
        name: active.name,
        primaryColor: active.primaryColor,
        startAt: new Date(active.startAt),
        endAt: new Date(active.endAt),
        userCount: active.userCount,
        userMaxCount: active.userMaxCount
    }))

    return(
        <div className="pb-16">
            <EventHero groupId={groupId} name={data?.name || "찾을 수 없음"} status={data?.status || "CLOSED"} startAt={data?.startAt} endAt={data?.endAt} memberCount={12}/>

            {/* 왼쪽은 할 일(액티브), 오른쪽은 참고(소개) */}
            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
                <div className="min-w-0 flex-1">
                    <EventActives actives={activesData} action={<AddActiveButton groupId={groupId} eventId={eventId}/>}/>
                </div>

                <EventAbout
                    description={data?.description}
                    className="border-t border-zinc-200 pt-6 lg:w-64 lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 dark:border-zinc-800"
                />
            </div>
        </div>
    )
}
