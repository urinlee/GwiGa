import { prisma } from "@/lib/prisma";






export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const roomId = id;

    const body = await request.json();
    const { name, description, primaryColor, secondaryColor } = body;
    
    const newActive = await prisma.active.create({
        data: {
            name,
            description,
            primaryColor,
            secondaryColor,
            groupId: roomId,
        },
    });


    return new Response(JSON.stringify(newActive), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    });
}