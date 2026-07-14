import { requireAdmin, requireUser } from "@/lib/api/guard";
import {RouteContext} from "@/lib/api/params";
import { ok, route } from "@/lib/api/response";
import { memberActivesSchema } from "@/schemas/schemas";
import { setMemberActives } from "@/services/memberactive";


type Ctx = RouteContext<{ groupId: string; userid: string }>;

export const PUT = route<Ctx>(async (_req, { params }) => {
    const { groupId, userid } = await params;
    const userId = userid;
    const user = await requireUser();
    await requireAdmin(groupId, user.id);
    const { actives } = memberActivesSchema.parse(await _req.json());
    
    return ok(await setMemberActives(groupId, userId, actives));
})

