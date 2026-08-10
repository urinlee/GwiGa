import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { getMember } from "@/services/member";

// TODO: 인증 없음. 기존 isMember 호출은 결과를 버려 아무것도 막지 못해 제거했다.
export const GET = route<{ groupId: string; userid: string }>(async (_req, { params }) => {
    return ok(await getMember(params.groupId, params.userid));
});
