import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { updateMemberNickname } from "@/services/member";
import { memberNicknameSchema } from "@/schemas/schemas";
import { getUser } from "@/services/user";

// TODO: 인증 없음 — 누구나 남의 닉네임을 바꿀 수 있다
export const PATCH = route<{ groupId: string; userid: string }>(async (req, { params }) => {
    const { nickname } = memberNicknameSchema.parse(await req.json());
    const newNickname =
        nickname.length === 0 ? (await getUser(params.userid))?.name || "Unknown User" : nickname;

    await updateMemberNickname(params.groupId, params.userid, newNickname);
    return ok({ message: "Nickname updated successfully" });
});
