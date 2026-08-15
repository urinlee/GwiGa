import { verifyAdmin } from "@/lib/dal";
import { getEventById } from "@/services/event";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function EventSettingPage(props: PageProps<"/group/[groupid]/event/[eventid]/setting">) {
    const { groupid, eventid } = await props.params;
    // 그룹 설정과 달리 이벤트에 매인 화면이라 그룹 사이드바를 쓰지 않는다.
    await verifyAdmin(groupid);

    const event = await getEventById(groupid, eventid);

    return (
        <div className="pt-8 pb-16">
            <Link
                href={`/group/${encodeURIComponent(groupid)}/event/${encodeURIComponent(eventid)}`}
                className="inline-flex items-center gap-0.5 text-[12px] text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
                <ChevronLeft className="h-3.5 w-3.5" />
                {event?.name || "이벤트"}(으)로
            </Link>

            <h1 className="mt-6 text-3xl font-bold tracking-tight">이벤트 설정</h1>
            <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400">
                이 이벤트에만 적용되는 설정이에요. 그룹 전체 설정은 그룹 설정에서 바꿉니다.
            </p>

            <div className="mt-10 rounded-xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
                <p className="text-[13px] text-zinc-600 dark:text-zinc-400">아직 옮겨온 설정이 없어요</p>
                <p className="mt-1 text-[12px] text-zinc-600 dark:text-zinc-400">
                    신청 취소처럼 이벤트 단위로 다룰 것들이 여기로 들어옵니다
                </p>
            </div>
        </div>
    );
}
