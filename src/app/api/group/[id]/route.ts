import { prisma } from "@/lib/prisma";


//TODO
//외부인, 멤버, 어드민 이렇게 GET할수 있는 정보 정하기
export interface RoomWithSlug {
    params: Promise<{ id: string }>
}

export async function GET(req: Request,  { params }: RoomWithSlug) {
    const { id } = await params;
    const roomId = id


    if (!roomId) return Response.json({message:"id is empty"}, {status:400})

    const res = await prisma.group.findUnique({
        where: {
            id:roomId
        },
        include: {
            members:true
        }
    })

    return Response.json(res, {status:200})

}