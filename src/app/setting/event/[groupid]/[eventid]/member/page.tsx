import { verifyAdmin } from "@/lib/dal";

export default async function EventMemberSettingPage(props: PageProps<"/setting/event/[groupid]/[eventid]/member">) {
    const { groupid } = await props.params;
    await verifyAdmin(groupid);

    return (
        <>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
                이 이벤트에 들어와 있는 참가자와 신청을 다룹니다.
            </p>

            <div className="mt-8 rounded-xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
                <p className="text-[13px] text-zinc-600 dark:text-zinc-400">아직 옮겨온 설정이 없어요</p>
                <p className="mt-1 text-[12px] text-zinc-600 dark:text-zinc-400">
                    신청 승인·취소처럼 사람을 다루는 것들이 여기로 들어옵니다
                </p>
            </div>
        </>
    );
}
