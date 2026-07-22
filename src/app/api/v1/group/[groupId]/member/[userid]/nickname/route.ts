import { ok, route } from "@/lib/api/response";
import { MemberCtx } from "../route";
import { updateMemberNickname } from "@/services/member";
import { memberNicknameSchema } from "@/schemas/schemas";
import { getUser } from "@/services/user";



export const PATCH = route<MemberCtx>(async (req, { params }) => {
    const { groupId, userid } = await params;
    const { nickname } = memberNicknameSchema.parse(await req.json());
    const newNickname = nickname.length === 0 ? (await getUser(userid))?.name || "Unknown User" : nickname;

    await updateMemberNickname(groupId, userid, newNickname);
    return ok({ message: "Nickname updated successfully" });
})