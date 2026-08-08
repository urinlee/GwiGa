import { ok, created, route } from "@/lib/api/response";
import { RouteContext } from "@/lib/api/params";
import { createEvent, getEventsByGroupId } from "@/services/event";
import { requireAdmin, requireMember, requireUser } from "@/lib/api/guard";
import { EventStatus } from "@/generated/prisma/browser";
import { eventSchema } from "@/schemas/schemas";

type Ctx = RouteContext<{ groupId: string }>;

export const GET = route<Ctx>(async(req, {params}) => {
    const { groupId } = await params;
    const user = await requireUser();
    await requireMember(groupId, user.id);
    const raw = req.nextUrl.searchParams.get("status");
    const status = raw && raw in EventStatus ? (raw as EventStatus) : undefined;
    return ok(await getEventsByGroupId(groupId, status))
})

export const POST = route<Ctx>(async(req, {params}) => {
    const { groupId } = await params;
    const user = await requireUser();
    await requireAdmin(groupId, user.id);
    const data = eventSchema.parse(await req.json());
    return created(await createEvent(groupId, data))
})