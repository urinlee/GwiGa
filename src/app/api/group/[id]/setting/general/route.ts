import { prisma } from "@/lib/prisma";
import { roomGeneralSetSchema } from "@/schemas/setting/room/schemas";
import { getGroup, isAdmin } from "@/services/group/group";
import { getUser } from "@/utils/currentUser";


export interface RoomWithSlug {
    params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: RoomWithSlug) {
    const { id } = await params;
    const roomId = id

    const user = await getUser();

    if (!user) return new Response("Unauthorized", { status: 401 });

    if (!(await isAdmin(roomId, user.id))) {
        return new Response("Forbidden", { status: 403 });
    }

    const room = await getGroup(roomId);
    
    if (!room) return new Response("Not Found", { status: 404 });

    return new Response(JSON.stringify(room), { status: 200 });
}



export async function POST(req: Request, { params }: RoomWithSlug) {
    const { id } = await params;
    const roomId = id

    const user = await getUser();
    const body = roomGeneralSetSchema.parse(await req.json());
    

    if (!user) return new Response("Unauthorized", { status: 401 });

    if (!(await isAdmin(roomId, user.id))) {
        return new Response("Forbidden", { status: 403 });
    }

    const room = await getGroup(roomId);
    if (!room) return new Response("Not Found", { status: 404 });

    const updatedRoom = await prisma.group.update({
        where: { id: roomId },
        data: body
    });
    
    return new Response(JSON.stringify(updatedRoom), { status: 200 });
}