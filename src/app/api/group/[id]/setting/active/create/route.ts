import { prisma } from "@/lib/prisma";






export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const groupId = id;

    const body = await request.json();
    const { name, description, primaryColor, secondaryColor, applyToAll } = body;
    
    const newActive = await prisma.active.create({
        data: {
            name,
            description,
            primaryColor,
            secondaryColor,
            groupId: groupId,
        },
    });

    if (applyToAll) {
        const members = await prisma.groupMember.findMany({
            where: {
                groupId: groupId,
            },
            select: {
                userId: true,
            },
        });

        const memberActiveData= members.map(member => ({
            groupId: groupId,
            userId: member.userId,
            activeId: newActive.id,
            enable: false
        }));

        await prisma.memberActive.createMany({
            data: memberActiveData,
        });
    }


    return new Response(JSON.stringify(newActive), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    });
}