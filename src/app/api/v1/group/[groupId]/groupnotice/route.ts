import { requireAdmin, requireMember, requireUser } from "@/lib/api/guard";
import {RouteContext} from "@/lib/api/params";
import { created, ok, route } from "@/lib/api/response";
import { groupNoticeSchema } from "@/schemas/schemas";
import { createGroupNotice, deleteGroupNotice, getAllGroupNotices } from "@/services/groupnotice";

type Ctx = RouteContext<{ groupId: string }>;



export const GET = route<Ctx>(async (req, { params }) => {
    const { groupId } = await params;
    const skip = req.nextUrl.searchParams.get("skip");
    const take = req.nextUrl.searchParams.get("take");
    const badgeId = req.nextUrl.searchParams.get("badgeId");
    const user = await requireUser();
    const member = await requireMember(groupId, user.id);
    const search = req.nextUrl.searchParams.get("search");

    return ok(await getAllGroupNotices(groupId, member.id, badgeId ?? undefined, search ?? undefined, skip ? Number(skip) : undefined, take ? Number(take) : undefined));
});

export const POST = route<Ctx>(async (req, { params }) => {
    const { groupId } = await params;
    const user = await requireUser();
    await requireAdmin(groupId, user.id);

    const { title, content, badgeId } = groupNoticeSchema.parse(await req.json());

    return created(await createGroupNotice({ groupId, authorId: user.id, title, content, badgeId }));
});


