import { EventStatus, Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { EventInput } from "@/schemas/schemas";


export function getEventById(groupId: string, eventId: string) {
    return prisma.event.findUnique({
        where: {
            id: eventId,
            groupId: groupId
        }
    })
}

export function getEventsByGroupId(groupId: string, status?: EventStatus) {
    return prisma.event?.findMany({
        where: {
            groupId: groupId,
            ...(status && { status })
        }
    })
}

export function createEvent(groupId:string, data:EventInput) {
    return prisma.$transaction(async (tx) =>{
        const event = await tx.event.create({
            data:{
                groupId,
                name:data.name,
                description:data.description,
                startAt:data.startAt,
                endAt:data.endAt,
                minMember:data.minMember,
                maxMember:data.maxMember
            }
        })

        // 모집은 액티브가 아니라 Recruit 테이블이다.
        // 이벤트당 여러 번 열 수 있어(1차·추가 모집) 여기서는 첫 회차만 만든다.
        if (data.recruit){
            await tx.recruit.create({
                data:{
                    eventId:event.id,
                    groupId:groupId,
                    notice:data.recruit.description,
                    startAt:data.recruit.startAt,
                    endAt:data.recruit.endAt,
                }
            })
        }

        // 생성된 이벤트를 돌려줘야 라우트가 응답에 담고, 폼이 상세 페이지로 이동할 수 있다.
        return event;
    })
}

export function updateEvent(eventId:string, data: Prisma.EventUpdateInput) {
    return prisma.event?.update({
        where: {
            id: eventId
        },
        data: data
    })
}

export function deleteEvent(eventId:string) {
    return prisma.event?.delete({
        where: {
            id: eventId
        }
    })
}

export function setOnGoingEvent(eventId: string) {
    return prisma.event?.update({
        where: {
            id: eventId
        },
        data: {
            status: "ONGOING"
        }
    })
}

export function setClosedEvent(eventId: string) {
    return prisma.event.update({
        where: {
            id: eventId
        },
        data: {
            status: "CLOSED"
        }
    })
}

export function getEventActive(eventId: string){
    return prisma.event.findUnique({
        where:{
            id:eventId
        },
        select:{
            actives:true
        }
    })
}



