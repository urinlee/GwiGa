import { sumRecruitCapacity } from "@/features/event/lib/capacity";
import { EventPicker, type EventPickItem } from "@/features/setting/event/components/EventPicker/EventPicker";
import { verifyAdmin } from "@/lib/dal";
import { getEventsByGroupId } from "@/services/event";

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
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 pt-10 pb-16">
            <h1 className="text-3xl font-bold tracking-tight">이벤트 설정</h1>
            <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400">설정을 바꿀 이벤트를 고르세요.</p>

            <div className="mt-8">
                <EventPicker groupId={groupid} events={items} />
            </div>
        </main>
    );
}
