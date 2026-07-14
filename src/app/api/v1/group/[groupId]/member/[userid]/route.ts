import { RouteContext } from "@/lib/api/params";
import { ok, route } from "@/lib/api/response";
import { isMember } from "@/services/group";
import { getMember } from "@/services/member";

export type MemberCtx = RouteContext<{ groupId: string; userid: string }>;


// 그룹 멤버 조회
export const GET = route<MemberCtx>(async (_req, { params }) => {
    const { groupId, userid } = await params;
    await isMember(groupId, userid);
    const member = await getMember(groupId, userid);
    
    return ok(member);
})