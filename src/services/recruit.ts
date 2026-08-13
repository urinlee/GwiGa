import { prisma } from "@/lib/prisma";
import type { RecruitStatus } from "@/generated/prisma/enums";
import type { RecruitInput } from "@/schemas/schemas";

export function getRecruits(groupId: string, eventId?: string) {
    return prisma.recruit.findMany({
        where: { groupId, eventId },
        // 취소한 신청자는 행이 남아 있으므로 APPLIED만 센다.
        // 집계는 조인이라 소비처가 대신할 수 없어 여기서 얹는다.
        include: { _count: { select: { applicants: { where: { status: "APPLIED" } } } } },
        orderBy: { createdAt: "asc" },
    });
}

/** 회차를 연다. notice는 폼에서 description으로 부르므로 여기서 이름을 맞춘다. */
export function createRecruit(groupId: string, eventId: string, data: RecruitInput) {
    return prisma.recruit.create({
        data: {
            groupId,
            eventId,
            title: data.title,
            notice: data.description,
            capacity: data.capacity,
            startAt: data.startAt,
            endAt: data.endAt,
        },
    });
}

/** groupId를 함께 조건에 넣어 다른 그룹의 모집을 건드리지 못하게 한다. */
export function updateRecruitStatus(groupId: string, recruitId: string, status: RecruitStatus) {
    return prisma.recruit.update({
        where: { id: recruitId, groupId },
        data: { status },
    });
}
