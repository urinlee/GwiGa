import { prisma } from "@/lib/prisma";





export async function POST(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;
    
    const body = await request.json();
    const { memberActiveId } = body;

    const existingMemberActive = await prisma.memberActive.delete({
        where: {
            id: memberActiveId
        }
    });

    return new Response(JSON.stringify(existingMemberActive), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    });
}