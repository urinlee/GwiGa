import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyEventMember, verifyMember } from "@/lib/dal";
import { getActives } from "@/services/active";
import { getRecruits } from "@/services/recruit";

type Params = { groupId: string;};

export const GET = route<Params>(async (req, { params }) => {
    await verifyMember(params.groupId);

    const eventId = req.nextUrl.searchParams.get("eventId") || undefined;

    return ok(await getRecruits(params.groupId, eventId));
});