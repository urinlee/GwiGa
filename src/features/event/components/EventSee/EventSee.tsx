import { EventHero } from "../EventHero/EventHero";
import { getEventById } from "@/services/event";
import { verifyMember } from "@/lib/dal";
import { EventActives } from "../EventActives/EventActives";
import { EventAbout } from "../EventAbout/EventAbout";
import { getActives } from "@/services/active";
import { AddActiveButton } from "../AddActiveButton/AddActiveButton";
import { Recruit, RecruitList } from "../RecruitList/RecruitList";
import { getRecruits } from "@/services/recruit";
import { sumRecruitCapacity } from "../../lib/capacity";
import { EventSettingLink } from "../EventSettingLink/EventSettingLink";
import { isAdmin } from "@/services/group";

export async function EventSee({groupId, eventId}:{groupId:string, eventId:string}) {
    const { user } = await verifyMember(groupId)
    // 설정은 관리자만 들어간다. 페이지도 막지만, 못 여는 문을 보여주지는 않는다.
    const canManage = await isAdmin(groupId, user.id)

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

    const recruits = await getRecruits(groupId, eventId)
    // startAt·endAt은 nullable이라 그대로 넘긴다. new Date(null)은 1970년이 된다.
    const recruitsData : Recruit[] = recruits.map((recruit) => ({
        id: recruit.id,
        status: recruit.status,
        title: recruit.title,
        description: recruit.notice,
        startAt: recruit.startAt,
        endAt: recruit.endAt,
        userCount: recruit._count.applicants,
        userMaxCount: recruit.capacity
    }))

    return(
        <div className="pb-16">
            <EventHero groupId={groupId} name={data?.name || "찾을 수 없음"} status={data?.status || "CLOSED"} startAt={data?.startAt} endAt={data?.endAt} memberCount={9999} minMember={data?.minMember} capacity={sumRecruitCapacity(recruits)} action={canManage && <EventSettingLink groupId={groupId} eventId={eventId}/>}/>

            {/* 왼쪽은 할 일(액티브), 오른쪽은 참고(소개) */}
            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-10">
                <div className="min-w-0 flex-1">
                    <EventActives actives={activesData} action={<AddActiveButton groupId={groupId} eventId={eventId}/>}/>
                </div>
                <div className="flex flex-col gap-8">
                    <RecruitList recruits={recruitsData} groupId={groupId} eventId={eventId}/>
                    <EventAbout
                        description={data?.description}
                        className="border-t border-zinc-200 pt-6 lg:w-64 lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 dark:border-zinc-800"
                    />
                </div>
            </div>

        </div>
    )
}

