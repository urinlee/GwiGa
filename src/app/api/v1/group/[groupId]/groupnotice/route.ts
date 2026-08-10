import { route } from "@/lib/api/route";
import { created, ok } from "@/lib/api/response";
import { verifyAdmin, verifyMember } from "@/lib/dal";
import { groupNoticeSchema } from "@/schemas/schemas";
import { createGroupNotice, getAllGroupNotices } from "@/services/groupnotice";

type Params = { groupId: string };

export const GET = route<Params>(async (req, { params }) => {
    const { member } = await verifyMember(params.groupId);

    const skip = req.nextUrl.searchParams.get("skip");
    const take = req.nextUrl.searchParams.get("take");
    const badgeId = req.nextUrl.searchParams.get("badgeId");
    const search = req.nextUrl.searchParams.get("search");

    return ok(
        await getAllGroupNotices(
            params.groupId,
            member.id,
            badgeId ?? undefined,
            search ?? undefined,
            skip ? Number(skip) : undefined,
            take ? Number(take) : undefined,
        ),
    );
});

export const POST = route<Params>(async (req, { params }) => {
    const { user } = await verifyAdmin(params.groupId);

    const { title, content, badgeId } = groupNoticeSchema.parse(await req.json());
    return created(
        await createGroupNotice({ groupId: params.groupId, authorId: user.id, title, content, badgeId }),
    );
});
