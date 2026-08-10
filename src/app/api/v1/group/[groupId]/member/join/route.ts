import { getGroup, isMember } from "@/services/group";
import { route } from "@/lib/api/route";
import { HttpError, ok } from "@/lib/api/response";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

type Params = { groupId: string };

// 초대 링크 미리보기용이라 로그인 전에도 열어 둔다
export const GET = route<Params>(async (_req, { params }) => {
    const group = (await getGroup(params.groupId, { members: true })) as
        | { members: unknown[]; name: string }
        | null;
    if (!group) throw new HttpError(404, "GROUP_NOT_FOUND", "group is Not Found");

    return ok({ membersNum: group.members.length, name: group.name });
});

export const POST = route<Params>(async (_req, { params }) => {
    const user = await verifySession();

    if (await isMember(params.groupId, user.id)) {
        throw new HttpError(403, "ALREADY_MEMBER", `you are already member of ${params.groupId}`);
    }
    if (!(await getGroup(params.groupId))) {
        throw new HttpError(404, "GROUP_NOT_FOUND", "group is Not Found");
    }

    const member = await prisma.groupMember.create({
        data: { groupId: params.groupId, userId: user.id },
    });

    return ok({ MemberId: member.id });
});
