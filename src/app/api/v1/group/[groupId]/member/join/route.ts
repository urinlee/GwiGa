import { getGroup, isMember } from "@/services/group";
import { RouteContext } from "@/lib/api/params";
import { getCurrentUser } from "@/utils/currentUser";
import { prisma } from "@/lib/prisma";



export async function GET(req:Request, {params}:RouteContext<{ groupId: string }>) {
    const { groupId } = await params;

    const group = await getGroup(groupId, {members:true}) as { members: any[]; name: string } | null;
    if (!group) {return Response.json({error:"group is Not Found"}, {status:404})}
    
    const {members, name} = group;
    return Response.json({
        membersNum:members.length,
        name:name
    }, {status:200})
}

export async function POST(req:Request, {params}:RouteContext<{ groupId: string }>) {
    const { groupId } = await params;
    console.log("groupid: ", groupId)

    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return Response.json({ code:"NOT_LOGGED_IN", error: "need login" }, { status: 401 });
    }

    const RUMember = await isMember(groupId, currentUser.id)
    const group = await getGroup(groupId)

    //얘가 불가능한 경우
    if (RUMember) return Response.json({ code:"ALREADY_MEMBER", error:`you are already member of ${groupId}` }, {status:403})
    if (!group) {return Response.json({ code:"GROUP_NOT_FOUND", error:"group is Not Found"}, {status:404})}

    //가능할때
    const userGroupMember = await prisma.groupMember.create({
        data:{
            groupId:groupId,
            userId:currentUser.id
        }
    })

    if (userGroupMember){
        return Response.json({ MemberId:userGroupMember.id }, {status:200})
    }

    
}