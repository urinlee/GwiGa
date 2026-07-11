import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const groupId = id;

    const body = await request.json();
    const { activeId } = body;

    const deletedActive = await prisma.active.delete({
        where: {
            groupId: groupId,
            id: activeId,
        },
    });

    return new Response(JSON.stringify(deletedActive), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}