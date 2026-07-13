import { prisma } from "@/lib/prisma";
import type { ActiveSettingForm } from "@/schemas/setting/group/schemas";

export async function listActives(groupId: string) {
    return prisma.active.findMany({ where: { groupId } });
}

/**
 * 액티브를 생성한다. `applyToAll`이면 그룹의 모든 멤버에게 memberActive(enable=false)를 함께 만든다.
 * 액티브 생성과 memberActive 일괄 생성을 하나의 트랜잭션으로 묶어 반쪽 저장을 방지한다.
 */
export async function createActive(
    groupId: string,
    data: ActiveSettingForm,
    applyToAll: boolean,
) {
    return prisma.$transaction(async (tx) => {
        const active = await tx.active.create({
            data: { ...data, groupId },
        });

        if (applyToAll) {
            const members = await tx.groupMember.findMany({
                where: { groupId },
                select: { userId: true },
            });

            if (members.length > 0) {
                await tx.memberActive.createMany({
                    data: members.map((member) => ({
                        groupId,
                        userId: member.userId,
                        activeId: active.id,
                        enable: false,
                    })),
                });
            }
        }

        return active;
    });
}

/** groupId를 함께 조건에 넣어 다른 그룹의 액티브를 수정하지 못하게 한다. */
export async function updateActive(
    groupId: string,
    activeId: string,
    data: ActiveSettingForm,
) {
    return prisma.active.update({
        where: { id_groupId: { id: activeId, groupId } },
        data,
    });
}

/** groupId를 함께 조건에 넣어 다른 그룹의 액티브를 삭제하지 못하게 한다. */
export async function deleteActive(groupId: string, activeId: string) {
    return prisma.active.delete({
        where: { id_groupId: { id: activeId, groupId } },
    });
}
