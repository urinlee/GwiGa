import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyMember, verifyNoticeAuthorOrAdmin } from "@/lib/dal";
import { addGroupNoticeRecord, deleteGroupNotice, getGroupNotice, updateGroupNotice } from "@/services/groupnotice";
import { groupNoticeSchema } from "@/schemas/schemas";

type Params = { groupId: string; noticeId: string };

export const GET = route<Params>(async (_req, { params }) => {
    const { member } = await verifyMember(params.groupId);

    await addGroupNoticeRecord(params.groupId, params.noticeId, member.id); // 조회수 증가
    return ok(await getGroupNotice(params.noticeId));
});

export const DELETE = route<Params>(async (_req, { params }) => {
    await verifyNoticeAuthorOrAdmin(params.groupId, params.noticeId);

    await deleteGroupNotice(params.noticeId);
    return ok({ message: "Group notice deleted successfully" });
});

export const PUT = route<Params>(async (req, { params }) => {
    await verifyNoticeAuthorOrAdmin(params.groupId, params.noticeId);

    const { title, content, badgeId } = groupNoticeSchema.parse(await req.json());
    return ok(await updateGroupNotice({ noticeId: params.noticeId, title, content, badgeId }));
});
