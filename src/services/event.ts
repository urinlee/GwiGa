import { Prisma } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";


export function getEventById(groupId: string, eventId: string) {
    return prisma.event.findUnique({
        where: {
            id: eventId,
            groupId: groupId
        }
    })
}

export function getEventsByGroupId(groupId: string) {
    return prisma.event.findMany({
        where: {
            groupId: groupId
        }
    })
}

export function createEvent(groupId: string, name: string, startAt: Date, endAt: Date) {
    return prisma.event.create({
        data: {
            groupId,
            name,
            description: "",
            startAt,
            endAt,
            status: "RECRUITING"
        }
    })
}

export function updateEvent(eventId:string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
        where: {
            id: eventId
        },
        data: data
    })
}

export function deleteEvent(eventId:string) {
    return prisma.event.delete({
        where: {
            id: eventId
        }
    })
}

export function setOnGoingEvent(eventId: string) {
    return prisma.event.update({
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
