import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const createParticipantSchema = z.object({
  username: z.string().trim().min(1),
  imageUrl: z.string().url().optional(),
  enabledStatusIds: z.array(z.string().min(1)).optional(),
  enabledStatuses: z.array(z.string().trim().min(1)).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const statuses = await prisma.roomStatus.findMany({
    where: { roomId },
    orderBy: { label: "asc" },
  });
  const participants = await prisma.participant.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    include: {
      enabledStatuses: {
        include: { status: true },
      },
    },
  });
  const allStatus = statuses.map((status) => status.label);

  return Response.json({
    participants: participants.map((participant) => ({
      id: participant.id,
      username: participant.username,
      imageUrl: participant.imageUrl,
      allStatus,
      enableStatus: participant.enabledStatuses.map(({ status }) => status.label),
    })),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const body = await request.json();
  const parsed = createParticipantSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  const enabledStatusIds = new Set(parsed.data.enabledStatusIds ?? []);

  if (parsed.data.enabledStatuses) {
    const statuses = await Promise.all(
      parsed.data.enabledStatuses.map((label) =>
        prisma.roomStatus.upsert({
          where: { roomId_label: { roomId, label } },
          update: {},
          create: { roomId, label },
        })
      )
    );

    statuses.forEach((status) => enabledStatusIds.add(status.id));
  }

  const participant = await prisma.participant.create({
    data: {
      username: parsed.data.username,
      imageUrl: parsed.data.imageUrl,
      roomId,
      enabledStatuses: {
        create: Array.from(enabledStatusIds).map((statusId) => ({
          status: { connect: { id: statusId } },
        })),
      },
    },
    include: {
      enabledStatuses: {
        include: { status: true },
      },
    },
  });

  return Response.json(
    {
      participant: {
        id: participant.id,
        username: participant.username,
        imageUrl: participant.imageUrl,
        enableStatus: participant.enabledStatuses.map(({ status }) => status.label),
      },
    },
    { status: 201 }
  );
}
