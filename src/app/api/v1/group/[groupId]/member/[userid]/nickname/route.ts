import { ok, route } from "@/lib/api/response";
import { MemberCtx } from "../route";
import { updateMemberNickname } from "@/services/member";
import { MemberNicknameSchema } from "@/schemas/setting/group/schemas";
import { getUser } from "@/services/user";



export const PATCH = route<MemberCtx>(async (req, { params }) => {
    const { id, userid } = await params;
    const groupId = id;
    const { nickname } = MemberNicknameSchema.parse(await req.json());
    const newNickname = nickname.length === 0 ? (await getUser(userid))?.name || "Unknown User" : nickname;

    await updateMemberNickname(groupId, userid, newNickname);
    return ok({ message: "Nickname updated successfully" });
})