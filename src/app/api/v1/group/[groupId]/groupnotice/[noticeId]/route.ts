import { ok, route } from "@/lib/api/response";
import {RouteContext} from "@/lib/api/params";
import { requireGroupNoticeAuthorOrAdmin, requireMember, requireUser } from "@/lib/api/guard";
import { deleteGroupNotice, updateGroupNotice } from "@/services/groupnotice";
import { groupNoticeSetSchema } from "@/schemas/schemas";


export type GroupNoticeContext = RouteContext<{ groupId: string; noticeId: string }>;

export const DELETE = route<GroupNoticeContext>(async (_req, { params }) => {
    const { groupId, noticeId } = await params;
    const user = await requireUser();
    await requireGroupNoticeAuthorOrAdmin(groupId, noticeId, user.id);
    await deleteGroupNotice(noticeId);
    return ok({ message: "Group notice deleted successfully" });
})


export const PUT = route<GroupNoticeContext>(async (req, { params }) => {
    const { groupId, noticeId } = await params;
    const user = await requireUser();
    await requireGroupNoticeAuthorOrAdmin(groupId, noticeId, user.id);

    const { title, content } = groupNoticeSetSchema.parse(await req.json());
    return ok( await updateGroupNotice(noticeId, title, content));
});