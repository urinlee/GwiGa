import { prisma } from "@/lib/prisma";
import { groupGeneralSetSchema } from "@/schemas/setting/group/schemas";
import { getGroup, isAdmin } from "@/services/group/group";
import { getUser } from "@/utils/currentUser";


export interface GroupWithSlug {
    params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: GroupWithSlug) {
    const { id } = await params;
    const groupId = id

    const user = await getUser();

    if (!user) return new Response("Unauthorized", { status: 401 });

    if (!(await isAdmin(groupId, user.id))) {
        return new Response("Forbidden", { status: 403 });
    }

    const group = await getGroup(groupId);
    
    if (!group) return new Response("Not Found", { status: 404 });

    return new Response(JSON.stringify(group), { status: 200 });
}



export async function POST(req: Request, { params }: GroupWithSlug) {
    const { id } = await params;
    const groupId = id

    const user = await getUser();
    const body = groupGeneralSetSchema.parse(await req.json());
    

    if (!user) return new Response("Unauthorized", { status: 401 });

    if (!(await isAdmin(groupId, user.id))) {
        return new Response("Forbidden", { status: 403 });
    }

    const group = await getGroup(groupId);
    if (!group) return new Response("Not Found", { status: 404 });

    const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: body
    });
    
    return new Response(JSON.stringify(updatedGroup), { status: 200 });
}