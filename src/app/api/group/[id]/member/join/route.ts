import { getGroup, isMember } from "@/utils/group";
import { RoomWithSlug } from "../../route";
import { getUser } from "@/utils/currentUser";
import { prisma } from "@/lib/prisma";



export async function GET(req:Request, {params}:RoomWithSlug) {
    const { id } = await params;
    const roomId = id

    const group = await getGroup(roomId, {members:true}) as { members: any[]; name: string } | null;
    if (!group) {return Response.json({error:"group is Not Found"}, {status:404})}
    
    const {members, name} = group;
    return Response.json({
        membersNum:members.length,
        name:name
    }, {status:200})
}

export async function POST(req:Request, {params}:RoomWithSlug) {
    const { id } = await params;
    const roomId = id
    console.log("roomid: ", roomId)

    const currentUser = await getUser()
    if (!currentUser) {
        return Response.json({ code:"NOT_LOGGED_IN", error: "need login" }, { status: 401 });
    }

    const RUMember = await isMember(roomId, currentUser.id)
    const group = await getGroup(roomId)

    //얘가 불가능한 경우
    if (RUMember) return Response.json({ code:"ALREADY_MEMBER", error:`you are already member of ${roomId}` }, {status:403})
    if (!group) {return Response.json({ code:"GROUP_NOT_FOUND", error:"group is Not Found"}, {status:404})}

    //가능할때
    const userGroupMember = await prisma.groupMember.create({
        data:{
            groupId:roomId,
            userId:currentUser.id
        }
    })

    if (userGroupMember){
        return Response.json({ MemberId:userGroupMember.id }, {status:200})
    }

    
}