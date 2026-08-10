import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifyAdmin, verifyMember } from "@/lib/dal";
import { getEventById, updateEvent, deleteEvent } from "@/services/event";
import { eventSchema } from "@/schemas/schemas";

type Params = { groupId: string; eventId: string };

export const GET = route<Params>(async (_req, { params }) => {
    await verifyMember(params.groupId);

    return ok(await getEventById(params.groupId, params.eventId));
});

export const PUT = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const data = eventSchema.parse(await req.json());
    return ok(await updateEvent(params.eventId, data));
});

export const DELETE = route<Params>(async (_req, { params }) => {
    await verifyAdmin(params.groupId);

    return ok(await deleteEvent(params.eventId));
});
