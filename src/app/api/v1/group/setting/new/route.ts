import { prisma } from "@/lib/prisma";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { verifySession } from "@/lib/dal";
import { z } from "zod";

const CreateGroupSchema = z.object({
  name: z.string().max(20).min(2),
  description: z.string().max(2000).optional(),
  tag: z.array(z.string()).transform((arr) => [...new Set(arr)]),
  status: z.array(z.string()).transform((arr) => [...new Set(arr)]),
});

export const POST = route(async (req) => {
  const user = await verifySession();

  const body = CreateGroupSchema.parse(await req.json());
  const ID = crypto.randomUUID();

  await prisma.group.create({
    data: {
      id: ID,
      name: body.name,
      description: body.description || null,
      tags: body.tag,
      adminId: user.id,
    },
  });

  // 기존 forEach+async는 await되지 않아 생성 전에 응답이 나갔다
  await Promise.all(
    body.status.map((status) => prisma.active.create({ data: { name: status, groupId: ID } })),
  );

  await prisma.groupMember.create({
    data: { groupId: ID, userId: user.id },
  });

  return ok({ id: ID });
});

//TODO: ReactForm + zod 사용 클라이언트에서
