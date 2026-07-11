import { prisma } from "@/lib/prisma";


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const groupId = id;

    const body = await request.json();
    const { activeId, name, description, primaryColor, secondaryColor } = body;
    
    const updatedActive = await prisma.active.update({
        where: {
            groupId: groupId,
            id: activeId,
        },
        data: {
            name,
            description,
            primaryColor,
            secondaryColor,
            groupId: groupId,
        },
    });

    return new Response(JSON.stringify(updatedActive), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}