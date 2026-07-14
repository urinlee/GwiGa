import { requireAdmin, requireMember, requireUser } from "@/lib/api/guard";
import {RouteContext} from "@/lib/api/params";
import { created, ok, route } from "@/lib/api/response";
import { groupNoticeSetSchema } from "@/schemas/schemas";
import { createGroupNotice, deleteGroupNotice, getGroupNotices } from "@/services/groupnotice";

type Ctx = RouteContext<{ groupId: string }>;

export const GET = route<Ctx>(async (_req, { params }) => {
    const { groupId } = await params;
    const user = await requireUser();
    await requireMember(groupId, user.id);

    return ok(await getGroupNotices(groupId));
});

export const POST = route<Ctx>(async (req, { params }) => {
    const { groupId } = await params;
    const user = await requireUser();
    await requireAdmin(groupId, user.id);

    const { title, content } = groupNoticeSetSchema.parse(await req.json());

    return created(await createGroupNotice(groupId, user.id, title, content));
});


