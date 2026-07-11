import { prisma } from "@/lib/prisma";
import { RouteContext } from "@/lib/api/params";


//TODO
//외부인, 멤버, 어드민 이렇게 GET할수 있는 정보 정하기
export async function GET(req: Request,  { params }: RouteContext<{ id: string }>) {
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