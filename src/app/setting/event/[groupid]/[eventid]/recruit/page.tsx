import { verifyAdmin } from "@/lib/dal";

export default async function EventRecruitSettingPage(props: PageProps<"/setting/event/[groupid]/[eventid]/recruit">) {
    const { groupid } = await props.params;
    await verifyAdmin(groupid);

    return (
        <>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">회차마다 기간과 정원을 따로 잡습니다.</p>

            <div className="mt-8 rounded-xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
                <p className="text-[13px] text-zinc-600 dark:text-zinc-400">아직 옮겨온 설정이 없어요</p>
                <p className="mt-1 text-[12px] text-zinc-600 dark:text-zinc-400">
                    회차 추가·마감처럼 모집을 다루는 것들이 여기로 들어옵니다
                </p>
            </div>
        </>
    );
}
