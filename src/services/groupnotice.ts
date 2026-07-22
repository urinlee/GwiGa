import { requireUser } from "@/lib/api/guard";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { GroupNoticeInput } from "@/schemas/schemas";
import { getCurrentUser } from "@/utils/currentUser";


/**
 * 그룹 공지사항 목록.
 * `memberId`는 `User.id`가 아니라 `GroupMember.id`다 (읽음 여부 판단에 쓰인다).
 */
export async function getAllGroupNotices(groupId: string, memberId: string, badgeId?: string, search?: string, skip?: number, take?: number) {
    const notices = await prisma.groupNotice.findMany({
        where: { 
            groupId, 
            badgeId,
            ...(search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ]
            } : {})
        },
        include: {
            author: { select: { id: true, name: true, image: true } },
            badge: true,
            reads: { where: { memberId }, take: 1, select: { id: true } }, // isRead: 이 멤버가 읽었나
            _count: { select: { reads: true } },                            // 총 조회수 (= reads 행 수)
        },
        // (createdAt, id) 복합 정렬 — prev/next 커서와 일치 + 동시각 tie에서 pagination 중복/누락 방지
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: skip,
        take: take ?? 200,
    });

    const totalCount = await prisma.groupNotice.count({ where: { groupId } });

    const badges = await prisma.groupNoticeBadge.findMany({
        where: { groupId },
        select: { id: true, name: true, backgroundColor: true, textColor: true, _count: { select: { notices: true } } },
    });

    return {
        totalCount,
        badges,
        notices: notices.map(({ reads, _count, ...notice }) => ({
            ...notice,
            isRead: reads.length > 0,        // 이 멤버의 읽음 행이 있으면 읽음
            readCount: _count.reads,          // 총 조회수
        })),
    };
}

export async function getGroupNotice(noticeId: string) {
    const notice = await prisma.groupNotice.findUnique({
        where: { id: noticeId },
        include: {
            author: { select: { id: true, name: true, image: true } },
            badge: true,
            _count: { select: { reads: true } },
        },
    });

    if (!notice) return null;

    const { _count, ...rest } = notice;
    return {
        ...rest,
        readCount: _count.reads, // 총 조회수 (= reads 행 수)
    };
}


export async function getAdjacentGroupNotices(noticeId: string, memberId: string) {
    const anchor = await prisma.groupNotice.findUnique({
        where: { id: noticeId },
        select: { groupId: true, createdAt: true },
    });
    if (!anchor) return { prev: null, next: null };

    // 이전/다음 글에서 가져올 필드 + 이 멤버의 안읽음 판단용 reads
    const neighborSelect = {
        id: true,
        title: true,
        createdAt: true,
        reads: { where: { memberId }, take: 1, select: { id: true } },
        preview: true, // 미리보기용

    } satisfies Prisma.GroupNoticeSelect;

    // (createdAt, id) 복합 커서 — 같은 createdAt에서도 순서가 흔들리지 않게
    const [prev, next] = await Promise.all([
        // 이전 글 = 이 글보다 오래된 것 중 가장 가까운 글
        prisma.groupNotice.findFirst({
            where: {
                groupId: anchor.groupId,
                OR: [
                    { createdAt: { lt: anchor.createdAt } },
                    { createdAt: anchor.createdAt, id: { lt: noticeId } },
                ],
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: neighborSelect,
        }),
        // 다음 글 = 이 글보다 최신인 것 중 가장 가까운 글
        prisma.groupNotice.findFirst({
            where: {
                groupId: anchor.groupId,
                OR: [
                    { createdAt: { gt: anchor.createdAt } },
                    { createdAt: anchor.createdAt, id: { gt: noticeId } },
                ],
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            select: neighborSelect,
        }),
    ]);

    const toNeighbor = (n: typeof prev) =>
        n
            ? { id: n.id, title: n.title, createdAt: n.createdAt, preview: n.preview, isUnread: n.reads.length === 0 }
            : null;

    return {
        prev: toNeighbor(prev), // 이전 글 (없으면 null)
        next: toNeighbor(next), // 다음 글 (없으면 null)
    };
}



export async function addGroupNoticeRecord(groupId: string, noticeId: string) {
    const currentUser = await requireUser();
    const member = await prisma.groupMember.findUnique({
        where: { groupId_userId: { groupId, userId: currentUser.id } },
        select: { id: true },
    });
    if (!member) throw new Error("Member not found");
    return prisma.groupNoticeRead.create({
        data: {
            noticeId,
            groupId,
            memberId: member.id,
        },
    });
}




/** 목록용 미리보기: 개행·연속공백을 한 칸으로 정리한 뒤 앞 30자 */
function toPreview(content: string): string {
    return content.replace(/\s+/g, " ").trim().slice(0, 30);
}

interface createGroupNoticeParams extends GroupNoticeInput {
    groupId: string;
    authorId: string;
}

interface updateGroupNoticeParams extends GroupNoticeInput {
    noticeId: string;
}



//그룹 공지사항 항목 만들기
export async function createGroupNotice({ groupId, authorId, title, content, badgeId }: createGroupNoticeParams) {
    return prisma.groupNotice.create({
        data: {
            groupId,
            authorId,
            title,
            content,
            badgeId,
            preview: toPreview(content),
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
export async function updateGroupNotice({ noticeId, title, content, badgeId }: updateGroupNoticeParams) {
    return prisma.groupNotice.update({
        where: { id: noticeId },
        data: {
            title,
            content,
            badgeId,
            preview: toPreview(content),
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

export async function isGroupNoticeAuthorByMemberId(noticeId: string, memberId: string): Promise<boolean> {
    const notice = await prisma.groupNotice.findUnique({
        where: { id: noticeId },
    });
    if (!notice) return false;

    const member = await prisma.groupMember.findUnique({
        where: { id: memberId },
    });
    if (!member) return false;

    return notice.authorId === member.userId;
}




// 여기서부턴 badge 관련 서비스

export async function getGroupNoticeBadges(groupId: string) {
    return prisma.groupNoticeBadge.findMany({
        where: { groupId }
    });
}