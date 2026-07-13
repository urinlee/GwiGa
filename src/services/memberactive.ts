import { prisma } from "@/lib/prisma";
import { MemberActiveItem } from "@/schemas/setting/group/schemas";


export function getMemberActive(groupId: string, userId: string) {
    return prisma.groupMember.findUnique({
        where: {
            groupId_userId: { groupId, userId },
        }
    });
}

export function getGroupMemberActives(groupId: string) {
    return prisma.memberActive.findMany({
        where: {
            groupId,
        },
        include: {
            active: true,
            groupMember: { include: { user: true } },
        },
    });
}



//desired중 기존에 할당되어 수정, 기존에 할당되지 않은건 없애기, 할당되어 있는 액티브중 desired에 없는건 삭제
export async function setMemberActives(groupId: string, userId: string, desired: MemberActiveItem[]) {
    return prisma.$transaction(async (tx) => {
        const existing = await tx.memberActive.findMany({
            where: {
                groupId,
                userId,
            },
            select: {
                activeId: true,
            },
        });
        
        const desiredActiveIds = desired.map((d) => d.activeId);
        const existingActiveIds = existing.map((e) => e.activeId);

        const toRemove = existing.filter((e) => !desiredActiveIds.includes(e.activeId));

        // 삭제 먼저
        if (toRemove.length > 0) {
            await tx.memberActive.deleteMany({
                where: {
                    groupId,
                    userId,
                    activeId: { in: toRemove.map((r) => r.activeId) },
                },
            });
        }

        // 추가 및 수정
        for (const { activeId, ...setting } of desired) {
            await tx.memberActive.upsert({
                where: {
                    groupId_userId_activeId: {
                        groupId,
                        userId,
                        activeId,
                    },
                },
                create: {
                    groupId,
                    userId,
                    activeId,
                    ...setting,
                },
                update: {
                    ...setting,
                },
            });
        }

        return tx.memberActive.findMany({ where: { groupId, userId }, include: { active: true } });

    });
    
}
