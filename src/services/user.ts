import { prisma } from "@/lib/prisma";


export function getUser(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
    });
}