import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const GroupRoomSchema = z.object({
    name: z.string().max(20).min(2),
    description: z.string().max(2000).optional(),
    tag: z.array(z.string()),
    status: z.array(z.string())
})

export async function POST(req: Request) {
    const body = GroupRoomSchema.safeParse(await req.json());
    const session = await auth();

    if (!body.success) {
        return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
    }
    if (!session) {
        return NextResponse.json({ error: "need login" }, { status: 400 });
    }

    const ID = crypto.randomUUID();

    await prisma.group.create({
        data: {
            id:ID,
            name: body.data.name,
            description: body.data.description,
            adminId:session?.user.id
        },
    });


    return NextResponse.json({
        id:ID
  }, {
    status:200
  });
}


//TODO: ReactForm + zod 사용 클라이언트에서