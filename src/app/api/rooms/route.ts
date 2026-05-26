import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const createRoomSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  date: z.coerce.date(),
  startTime: z.string().trim().optional(),
  endTime: z.string().trim().optional(),
  location: z.string().trim().optional(),
  statuses: z.array(z.string().trim().min(1)).default(["입금", "도착", "귀가", "뒤풀이"]),
});

export async function GET() {
  const rooms = await prisma.room.findMany({
    orderBy: { date: "asc" },
    include: {
      _count: { select: { participants: true } },
      statuses: { orderBy: { label: "asc" } },
    },
  });

  return Response.json({
    rooms: rooms.map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      date: room.date,
      startTime: room.startTime,
      endTime: room.endTime,
      location: room.location,
      participantCount: room._count.participants,
      statuses: room.statuses.map((status) => status.label),
    })),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createRoomSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { statuses, ...roomData } = parsed.data;
  const room = await prisma.room.create({
    data: {
      ...roomData,
      statuses: {
        create: Array.from(new Set(statuses)).map((label) => ({ label })),
      },
    },
    include: { statuses: true },
  });

  return Response.json({ room }, { status: 201 });
}
