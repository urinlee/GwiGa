import { prisma } from "@/lib/prisma";
import { RouteContext } from "@/lib/api/params";
import { ok, route } from "@/lib/api/response";
import { getGroupMemberActives } from "@/services/memberactive";


export type MemberActiveCtx = RouteContext<{ groupId: string }>;

export const GET = route<MemberActiveCtx>(async (_req, { params }) => {
    const { groupId } = await params;

    const groupMemberActives = await getGroupMemberActives(groupId);

    // 이 엔드포인트는 "멤버 목록"이므로 group 전체가 아니라 members 배열을 반환한다
    return ok(groupMemberActives);
})