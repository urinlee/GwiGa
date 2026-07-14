import { prisma } from "@/lib/prisma";


export async function POST(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;
    
    const body = await request.json();
    const { userId, activeId, enable } = body;

    const existingMemberActive = await prisma.memberActive.create({
        data: {
            groupId: groupId,
            userId: userId,
            activeId: activeId,
            enable: enable
        }
    });

    return new Response(JSON.stringify(existingMemberActive), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    });
}