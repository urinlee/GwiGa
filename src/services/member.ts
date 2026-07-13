import { prisma } from "@/lib/prisma";
import { getUser } from "./user";


export async function getMember(groupId: string, userId: string) {
    return prisma.groupMember.findUnique({
        where: {
            groupId_userId: { groupId, userId },
        },
    });
}

export async function getMemberName(groupId: string, userId: string) {
    const member = await getMember(groupId, userId);
    if (!member) {
        const user = await getUser(userId);
        return user?.name || "Unknown User";
    } else {
        return member.nickname;
    }
}

export async function updateMemberNickname(groupId: string, userId: string, nickname: string) {
    return prisma.groupMember.update({
        where: {
            groupId_userId: { groupId, userId },
        },
        data: {
            nickname,
        },
    });
}