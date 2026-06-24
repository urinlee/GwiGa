import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";



export async function getGroup(id: string, include?: Record<string, boolean>) {
    return await prisma.group.findUnique({
        where: { id },
        include
    });
}

export async function isMember(groupId: string, userId: string): Promise<boolean> {
    const member = await prisma.groupMember.findUnique({
        where: {
            groupId_userId: { groupId, userId },
        }
    });
    return !!member;
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
