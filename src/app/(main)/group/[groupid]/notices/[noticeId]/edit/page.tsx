import { NoticeForm } from "@/features/notices/components/NoticeForm/NoticeForm";
import { getGroupNotice, getGroupNoticeBadges } from "@/services/groupnotice";
import { GroupNoticePageProps } from "../page";



export default async function NoticeEditPage({ params }: GroupNoticePageProps) {
    const { groupid, noticeId } = await params;
    const badges = await getGroupNoticeBadges(groupid);
    const notice = await getGroupNotice(noticeId) as {title: string, content: string, badgeId?: string} | undefined;
    return (
        <div className="mb-20">
            <NoticeForm groupId={groupid} noticeId={noticeId} badges={badges} defaultValues={notice} />
        </div>
    )
}