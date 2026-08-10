import { route } from "@/lib/api/route";
import { ok, created } from "@/lib/api/response";
import { verifyAdmin, verifyMember } from "@/lib/dal";
import { createEvent, getEventsByGroupId } from "@/services/event";
import { EventStatus } from "@/generated/prisma/browser";
import { eventSchema } from "@/schemas/schemas";

type Params = { groupId: string };

export const GET = route<Params>(async (req, { params }) => {
    await verifyMember(params.groupId);

    const raw = req.nextUrl.searchParams.get("status");
    const status = raw && raw in EventStatus ? (raw as EventStatus) : undefined;
    return ok(await getEventsByGroupId(params.groupId, status));
});

export const POST = route<Params>(async (req, { params }) => {
    await verifyAdmin(params.groupId);

    const data = eventSchema.parse(await req.json());
    return created(await createEvent(params.groupId, data));
});
