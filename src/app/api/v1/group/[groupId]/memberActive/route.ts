import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { getGroupMemberActives } from "@/services/memberactive";

// TODO: 인증 없음 — 비회원도 조회 가능
export const GET = route<{ groupId: string }>(async (_req, { params }) => {
    return ok(await getGroupMemberActives(params.groupId));
});
