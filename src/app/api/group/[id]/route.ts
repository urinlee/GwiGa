import { prisma } from "@/lib/prisma";


//TODO
//외부인, 멤버, 어드민 이렇게 GET할수 있는 정보 정하기
export interface GroupWithSlug {
    params: Promise<{ id: string }>
}

export async function GET(req: Request,  { params }: GroupWithSlug) {
    const { id } = await params;
    const groupId = id


    if (!groupId) return Response.json({message:"id is empty"}, {status:400})

    const res = await prisma.group.findUnique({
        where: {
            id:groupId
        },
        include: {
            members:true
        }
    })

    return Response.json(res, {status:200})

}