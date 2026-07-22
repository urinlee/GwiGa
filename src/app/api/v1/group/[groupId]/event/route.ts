import { ok, created, route } from "@/lib/api/response";
import { RouteContext } from "@/lib/api/params";
import { createEvent, getEventsByGroupId } from "@/services/event";
import { requireMember, requireUser } from "@/lib/api/guard";

type Ctx = RouteContext<{ groupId: string }>;

export const GET = route<Ctx>(async(_req, {params}) => {
    const { groupId } = await params;
    const user = await requireUser();
    await requireMember(groupId, user.id);
    return ok(await getEventsByGroupId(groupId))
})

export const POST = route<Ctx>(async(_req, {params}) => {
    const { groupId } = await params;
    const data = await _req.json();
    const { name, startAt, endAt } = data;
    return created(await createEvent(groupId, name, startAt, endAt))
})