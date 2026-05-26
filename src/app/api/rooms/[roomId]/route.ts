import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      statuses: { orderBy: { label: "asc" } },
      participants: {
        orderBy: { createdAt: "asc" },
        include: {
          enabledStatuses: {
            include: { status: true },
          },
        },
      },
    },
  });

  if (!room) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  const allStatus = room.statuses.map((status) => status.label);

  return Response.json({
    room: {
      id: room.id,
      name: room.name,
      description: room.description,
      date: room.date,
      startTime: room.startTime,
      endTime: room.endTime,
      location: room.location,
      participantCount: room.participants.length,
      statuses: allStatus,
      participants: room.participants.map((participant) => ({
        id: participant.id,
        username: participant.username,
        imageUrl: participant.imageUrl,
        allStatus,
        enableStatus: participant.enabledStatuses.map(({ status }) => status.label),
      })),
    },
  });
}
