import { ok, created, route } from "@/lib/api/response";
import { RouteContext } from "@/lib/api/params";
import { createEvent, getEventsByGroupId, getEventById, updateEvent, deleteEvent } from "@/services/event";
import { requireAdmin, requireMember, requireUser } from "@/lib/api/guard";
import { eventSchema } from "@/schemas/schemas";

type Ctx = RouteContext<{ groupId: string, eventId: string }>;

export const GET = route<Ctx>(async(_req, {params}) => {
    const { groupId, eventId } = await params;
    const user = await requireUser(); 
    await requireMember(groupId, user.id); 
    return ok(await getEventById(groupId, eventId));
})

export const PUT = route<Ctx>(async(_req, {params}) => {
    const { groupId, eventId } = await params;
    const data = eventSchema.parse(await _req.json());
    const user = await requireUser();
    await requireMember(groupId, user.id);
    await requireAdmin(groupId, user.id);
    return ok(await updateEvent(eventId, data));
});

export const DELETE = route<Ctx>(async(_req, {params}) => {
    const { groupId, eventId } = await params;
    const user = await requireUser();
    await requireMember(groupId, user.id);
    await requireAdmin(groupId, user.id);
    return ok(await deleteEvent(eventId));
});