import { EventHero } from "../EventHero/EventHero";
import { getEventById, getEventMembers } from "@/services/event";
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
import InfoCardsContainer from "@/components/ui/InfoCardsContainer/InfoCardsContainer";
import type { ParticipantsInfoCardProps, stateType } from "@/components/ui/InfoCardsContainer/types";
import { EventMemberCards } from "../EventMembers/EventMembers";

// Active.primaryColor·secondaryColor는 nullable이라 스키마 기본값과 같은 값으로 받는다.
const ACTIVE_FALLBACK_PRIMARY = "#F4F4F5";
const ACTIVE_FALLBACK_SECONDARY = "#57565C";

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

    // 참가자 현황은 이벤트에 들어온 사람과 이 이벤트에 걸린 액티브만 본다. 그룹 전체가 아니다.
    const eventMembers = await getEventMembers(groupId, eventId)
    const participants: ParticipantsInfoCardProps[] = eventMembers.map((eventMember) => ({
        memberId: eventMember.member.id,
        username: eventMember.member.nickname || eventMember.member.user.name || "이름 없음",
        avatarUrl: eventMember.member.user.image ?? undefined,
        userStatus: eventMember.member.memberActives.map((memberActive) => ({
            id: memberActive.active.id,
            name: memberActive.active.name,
            primaryColor: memberActive.active.primaryColor ?? ACTIVE_FALLBACK_PRIMARY,
            secondaryColor: memberActive.active.secondaryColor ?? ACTIVE_FALLBACK_SECONDARY,
            isTrue: memberActive.enable,
        })),
    }))

    // 아무도 안 가진 액티브도 필터에 남긴다. 0명이라는 사실 자체가 관리자에게 정보다.
    const activeStatuses: stateType[] = actives.map((active) => ({
        id: active.id,
        name: active.name,
        primaryColor: active.primaryColor ?? ACTIVE_FALLBACK_PRIMARY,
        secondaryColor: active.secondaryColor ?? ACTIVE_FALLBACK_SECONDARY,
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

            {/* 위 두 칸은 "무엇을 하는 이벤트인가", 여기부터는 "누가 어디까지 왔는가".
                카드가 가로로 깔려야 읽히니 좁은 레일이 아니라 폭 전체를 쓴다. */}
            <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
                <EventMemberCards
                    participants={participants}
                    allStatuses={activeStatuses}
                />
            </section>

        </div>
    )
}

