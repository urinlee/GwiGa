import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyAdmin } from "@/lib/dal";
import { memberActivesSchema } from "@/schemas/schemas";
import { setMemberActives } from "@/services/memberactive";

type Params = { groupId: string; userid: string };

export const PUT = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const { actives } = memberActivesSchema.parse(await req.json());
    return ok(await setMemberActives(params.groupId, params.userid, actives));
});
