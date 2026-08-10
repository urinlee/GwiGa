import { prisma } from "@/lib/prisma";
import { route } from "@/lib/api/route";
import { HttpError, ok } from "@/lib/api/response";
import { verifyAdmin } from "@/lib/dal";
import { groupGeneralSchema } from "@/schemas/schemas";
import { getGroup } from "@/services/group";

type Params = { groupId: string };

export const GET = route<Params>(async (_req, { params }) => {
    await verifyAdmin(params.groupId);

    const group = await getGroup(params.groupId);
    if (!group) throw new HttpError(404, "GROUP_NOT_FOUND");

    return ok(group);
});

export const POST = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const body = groupGeneralSchema.parse(await req.json());
    const group = await getGroup(params.groupId);
    if (!group) throw new HttpError(404, "GROUP_NOT_FOUND");

    return ok(await prisma.group.update({ where: { id: params.groupId }, data: body }));
});
