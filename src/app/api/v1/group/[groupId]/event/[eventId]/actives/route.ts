import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyEventMember, verifyMember } from "@/lib/dal";
import { getActives } from "@/services/active";

type Params = { groupId: string; eventId: string };

export const GET = route<Params>(async (_req, { params }) => {
    await verifyMember(params.groupId);
    await verifyEventMember(params.eventId);

    return ok(await getActives(params.groupId, params.eventId));
});
