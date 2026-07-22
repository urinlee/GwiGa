import { NoticeHero } from "@/features/notices/components/NoticeHero/NoticeHero";
import { addGroupNoticeRecord, getAdjacentGroupNotices, getGroupNotice, isGroupNoticeAuthorByMemberId } from "@/services/groupnotice";
import type { noticeOverview } from "@/features/notices/components/NoticeFooter/NoticeFooter";
import { getGroupMember } from "@/services/group";
import { getCurrentUser } from "@/utils/currentUser";
import type { NoticeBadge } from "@/features/notices/components/NoticeHero/NoticeHero";
import { NoticeContent } from "@/features/notices/components/NoticeContent/NoticeContent";
import NoticeFooter from "@/features/notices/components/NoticeFooter/NoticeFooter";
import { requireGroupNoticeAuthorOrAdmin } from "@/lib/api/guard";
import { NoticeAuthorMenu } from "@/features/notices/components/NoticeAuthorMenu/NoticeAuthorMenu";

export interface GroupNoticePageProps {
  params: {
    groupid: string;
    noticeId: string;
  };
}


export default async function GroupNoticePage({ params }: GroupNoticePageProps) {
    const { groupid, noticeId } = await params;
    const user = await getCurrentUser();
    const member = user ? await getGroupMember(groupid, user.id) : null;
    if (!member || !user) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
                <h1 className="text-2xl font-bold">권한이 없어요</h1>
                <p className="text-sm text-zinc-500">공지사항은 그룹 멤버만 볼 수 있어요.</p>
                <a
                    href={`/group/${groupid}/notices`}
                    className="mt-4 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                >
                    공지 목록으로
                </a>
            </div>
        );
    }

    const notice = await getGroupNotice(noticeId);
    const isAuthororAdmin = await isGroupNoticeAuthorByMemberId(noticeId, member.id);

    const adjece = member ? await getAdjacentGroupNotices(noticeId, member.id) : { prev: null, next: null };
    const prevNotice : noticeOverview | null = adjece.prev ? {
      id: adjece.prev?.id || "",
      title: adjece.prev?.title || "",
      contentPreview: adjece.prev?.preview || "",
      createdAt: adjece.prev?.createdAt || new Date(),
      updatedAt: adjece.prev?.createdAt || new Date(),
      isNew: !adjece.prev?.isUnread || false,
    } : null;

    const nextNotice: noticeOverview | null = adjece.next ? {
      id: adjece.next?.id || "",
      title: adjece.next?.title || "",
      contentPreview: adjece.next?.preview || "",
      createdAt: adjece.next?.createdAt || new Date(),
      updatedAt: adjece.next?.createdAt || new Date(),
      isNew: !adjece.next?.isUnread || false,
    } : null;

    await addGroupNoticeRecord(groupid, noticeId); // 조회수 증가
    return (
        <div className="mb-20">
            <NoticeHero 
              groupId={groupid} 
              noticeId={noticeId} 
              title={notice?.title || "게시글을 찾을 수 없음"} 
              date={notice?.createdAt.toLocaleString() || "없음"} 
              authorName={notice?.author?.name || "없음"} 
              badge={(notice?.badge) as NoticeBadge}
              viewCount={notice?.readCount || 0} />
            {isAuthororAdmin && <NoticeAuthorMenu noticeId={noticeId} />}
            <div className="border-b border-zinc-200 mt-10"/>
            <NoticeContent content={notice?.content || "게시글을 찾을 수 없습니다."} />
            <NoticeFooter previousNotice={prevNotice} nextNotice={nextNotice} />
        </div>
    )
}