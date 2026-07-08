import { prisma } from "@/lib/prisma";


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const roomId = id;


    const group = await prisma.group.findUnique({
        where: {
            id: roomId,
        },
        include: {
            actives: true,
        },
    });

    if (!group) {
        return new Response("Group not found", { status: 404 });
    }

    return new Response(JSON.stringify(group.actives), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}