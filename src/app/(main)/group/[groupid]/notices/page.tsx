import { NoticesField } from "@/features/notices/components/NoticesField/NoticesField";
import Link from "next/link";

interface GroupNoticePageProps {
  params: {
    groupid: string;
  };
}

export default async function GroupNoticePage({params}: GroupNoticePageProps) {
    const { groupid } = await params
    return(
        <div>
            <div className="pt-5">
                <Link href={`/group/${groupid}/dashboard`} className="text-[12px] text-neutral-400 dark:text-neutral-700 hover:underline">
                    &larr; 대시보드로 돌아가기
                </Link>
            </div>
            <div className="pt-2 pb-10">
                <NoticesField groupId={groupid} />
            </div>
        </div>
    )
}