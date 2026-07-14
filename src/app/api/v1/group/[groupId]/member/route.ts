import { prisma } from "@/lib/prisma";
import { RouteContext } from "@/lib/api/params";

// Next의 route handler는 (request, context) 순서다. params는 두 번째 인자에 있다.
export async function GET(_request: Request, { params }: RouteContext<{ groupId: string }>) {
    const { groupId } = await params;

    const group = await prisma.group.findUnique({
        where: {
            id: groupId,
        },
        include: {
            members: {
                include: {
                    user: true,
                }
            }
        }
    });

    if (!group) {
        return Response.json({ error: "Group not found" }, { status: 404 });
    }

    // 이 엔드포인트는 "멤버 목록"이므로 group 전체가 아니라 members 배열을 반환한다
    return Response.json(group.members, { status: 200 });
}