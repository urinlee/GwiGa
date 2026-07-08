import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CurrentUser, getUser } from "@/utils/currentUser";
import { NextResponse } from "next/server";
import { z } from "zod";

const GroupRoomSchema = z.object({
  name: z.string().max(20).min(2),
  description: z.string().max(2000).optional(),
  tag: z.array(z.string()).transform((arr) => [...new Set(arr)]),
  status: z.array(z.string()).transform((arr) => [...new Set(arr)]),
});

export async function POST(req: Request) {
  const body = GroupRoomSchema.safeParse(await req.json());
  const currentUser = await getUser();

  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }
  if (!currentUser) {
    return NextResponse.json(
      { code: "NOT_LOGGED_IN", error: "need login" },
      { status: 401 },
    );
  }

  const ID = crypto.randomUUID();

  await prisma.group.create({
    data: {
      id: ID,
      name: body.data.name,
      description: body.data.description || null,
      tags: body.data.tag,
      adminId: currentUser?.id,
    },
  });

  body.data.status.forEach(async (status, _) => {
    await prisma.active.create({
      data: {
        name: status,
        groupId: ID,
      },
    });
  });

  await prisma.groupMember.create({
    data: {
      groupId: ID,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(
    {
      id: ID,
    },
    {
      status: 200,
    },
  );
}

//TODO: ReactForm + zod 사용 클라이언트에서
