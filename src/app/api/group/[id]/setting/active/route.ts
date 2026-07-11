import { prisma } from "@/lib/prisma";


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const groupId = id;


    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
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