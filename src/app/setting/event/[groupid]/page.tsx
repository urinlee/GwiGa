import { sumRecruitCapacity } from "@/features/event/lib/capacity";
import { EventPicker, type EventPickItem } from "@/features/setting/event/components/EventPicker/EventPicker";
import { verifyAdmin } from "@/lib/dal";
import { getEventsByGroupId } from "@/services/event";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function EventSettingIndexPage({ params }: { params: Promise<{ groupid: string }> }) {
    const { groupid } = await params;
    await verifyAdmin(groupid);

    const events = (await getEventsByGroupId(groupid)) ?? [];
    const items: EventPickItem[] = events.map((event) => ({
        id: event.id,
        name: event.name,
        status: event.status,
        startAt: event.startAt,
        endAt: event.endAt,
        applicantCount: event.recruits.reduce((sum, recruit) => sum + recruit._count.applicants, 0),
        capacity: sumRecruitCapacity(event.recruits),
        recruitCount: event.recruits.length,
    }));

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <Link
                href={`/group/${encodeURIComponent(groupid)}/dashboard`}
                className="inline-flex items-center gap-0.5 text-[12px] text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
                <ChevronLeft className="h-3.5 w-3.5" />
                그룹 대시보드로 돌아가기
            </Link>

            <h1 className="mt-6 text-3xl font-bold tracking-tight">이벤트 설정</h1>
            <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400">설정을 바꿀 이벤트를 고르세요.</p>

            <div className="mt-8">
                <EventPicker groupId={groupid} events={items} />
            </div>
        </div>
    );
}
