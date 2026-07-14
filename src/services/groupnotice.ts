import { prisma } from "@/lib/prisma";


//그룹 공지사항 항목 가져오기
export async function getGroupNotices(groupId: string) {
    return prisma.groupNotice.findMany({
        where: { groupId },
        include: {
            author:{
                select: {
                    id:true,
                    name:true,
                    image:true
                }
            },
            readMembers:{
                select:{
                    userId:true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    });
}

//그룹 공지사항 항목 만들기
export async function createGroupNotice(groupId: string, authorId: string, title: string, content: string) {
    return prisma.groupNotice.create({
        data: {
            groupId,
            authorId,
            title,
            content,
        },
    });
}

//그룹 공지사항 항목 삭제
export async function deleteGroupNotice(noticeId: string) {
    return prisma.groupNotice.delete({
        where: { id: noticeId },
    });
}

//그룹 공지사항 항목 수정
export async function updateGroupNotice(noticeId: string, title: string, content: string) {
    return prisma.groupNotice.update({
        where: { id: noticeId },
        data: {
            title,
            content,
        },
    });
}


// 작성자인지
export async function isGroupNoticeAuthor(noticeId: string, userId: string): Promise<boolean> {
    const notice = await prisma.groupNotice.findUnique({
        where: { id: noticeId },
    });
    return notice?.authorId === userId;
}