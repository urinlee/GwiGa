import { requireAdmin, requireUser } from "@/lib/api/guard";
import { NoticeForm } from "@/features/notices/components/NoticeForm/NoticeForm";
import { getGroupNoticeBadges } from "@/services/groupnotice";

export default async function NewNoticePage({ params }: { params: Promise<{ groupid: string }> }) {
    const { groupid } = await params;
    const user = await requireUser();

    const badges = await getGroupNoticeBadges(groupid);

    try {
        await requireAdmin(groupid, user.id);
    } catch {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
                <h1 className="text-2xl font-bold">권한이 없어요</h1>
                <p className="text-sm text-zinc-500">공지사항은 그룹 관리자만 작성할 수 있어요.</p>
                <a
                    href={`/group/${groupid}/notices`}
                    className="mt-4 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                >
                    공지 목록으로
                </a>
            </div>
        );
    }

    return <NoticeForm groupId={groupid} badges={badges} />;
}
