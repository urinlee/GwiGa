import { ok, route } from "@/lib/api/response";
import {RouteContext} from "@/lib/api/params";
import { requireGroupNoticeAuthorOrAdmin, requireMember, requireUser } from "@/lib/api/guard";
import { addGroupNoticeRecord, deleteGroupNotice, getGroupNotice, updateGroupNotice } from "@/services/groupnotice";
import { groupNoticeSchema } from "@/schemas/schemas";


export type GroupNoticeContext = RouteContext<{ groupId: string; noticeId: string }>;


export const GET = route<GroupNoticeContext>(async (_req, { params }) => {
    const { groupId, noticeId } = await params;
    const user = await requireUser();
    await requireMember(groupId, user.id);
    await addGroupNoticeRecord(groupId, noticeId); // 조회수 증가

    return ok(await getGroupNotice(noticeId));

})


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

    const { title, content, badgeId } = groupNoticeSchema.parse(await req.json());
    return ok(await updateGroupNotice({ noticeId, title, content, badgeId }));
});