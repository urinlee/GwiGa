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

/**
 * 회차 신청자 명단. 취소한 사람도 행이 남으므로 그대로 보낸다 —
 * 누가 왔다 갔는지가 관리자에게는 정보다. 세는 것은 소비처가 status로 가른다.
 */
export function getApplicants(groupId: string, recruitId: string) {
    return prisma.recruitApplicant.findMany({
        // 다른 그룹의 회차를 id만 알고 들여다보지 못하게 관계로 막는다.
        where: { recruitId, recruit: { groupId } },
        include: { member: { include: { user: { select: { name: true } } } } },
        orderBy: { appliedAt: "asc" },
    });
}

/** groupId를 함께 조건에 넣어 다른 그룹의 모집을 건드리지 못하게 한다. */
export function updateRecruitStatus(groupId: string, recruitId: string, status: RecruitStatus) {
    return prisma.recruit.update({
        where: { id: recruitId, groupId },
        data: { status },
    });
}

/**
 * 회차 내용 수정. 폼이 늘 전체 필드를 보내므로 빈 값은 null로 덮어 쓴다 —
 * 그래야 한번 정한 정원이나 기간을 다시 비울 수 있다.
 */
export function updateRecruit(groupId: string, recruitId: string, data: RecruitInput) {
    return prisma.recruit.update({
        where: { id: recruitId, groupId },
        data: {
            title: data.title ?? null,
            notice: data.description ?? null,
            capacity: data.capacity ?? null,
            startAt: data.startAt ?? null,
            endAt: data.endAt ?? null,
        },
    });
}
