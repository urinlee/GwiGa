import { prisma } from "@/lib/prisma";



export async function getGroup(id: string, include?: Record<string, boolean>) {
    if (!id) {
        return null;
    }

    return await prisma.group.findUnique({
        where: { id },
        include
    });
}

export async function getMember(groupId: string, userId: string) {
    return await prisma.group.findUnique({
        where: {
            id: groupId,
            adminId: userId
        }
    })
}

/** 그룹의 멤버십 레코드. 멤버가 아니면 null. */
export async function getGroupMember(groupId: string, userId: string) {
    return await prisma.groupMember.findUnique({
        where: {
            groupId_userId: { groupId, userId },
        }
    });
}

export async function isMember(groupId: string, userId: string): Promise<boolean> {
    return !!(await getGroupMember(groupId, userId));
}

export async function isAdmin(groupId: string, userId: string): Promise<boolean> {
    const admin = await prisma.group.findUnique({
        where:{
            id:groupId,
            adminId:userId
        }
    })
    return !!admin;
}

export async function ImAdminGroup(userId:string) {
    return await prisma.user.findUnique({
        where:{
            id:userId
        },
        select:{
            AdminGroups:true
        }
    })
}

export async function ImGroupMember(userId:string, includeAdmin=false) {
    return await prisma.groupMember.findMany({
        where:{
            userId:userId,
            ...(includeAdmin ? {} : {
                group:{
                    adminId:{
                        not:userId
                    }
                }
            })
        },
        include:{
            group:true
        }
    })
}
