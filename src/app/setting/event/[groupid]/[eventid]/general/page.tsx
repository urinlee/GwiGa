import { verifyAdmin } from "@/lib/dal";

export default async function EventGeneralSettingPage(
    props: PageProps<"/setting/event/[groupid]/[eventid]/general">,
) {
    const { groupid } = await props.params;
    await verifyAdmin(groupid);

    return (
        <>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
                이 이벤트에만 적용되는 설정이에요. 그룹 전체 설정은 그룹 설정에서 바꿉니다.
            </p>

            <div className="mt-8 rounded-xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
                <p className="text-[13px] text-zinc-600 dark:text-zinc-400">아직 옮겨온 설정이 없어요</p>
                <p className="mt-1 text-[12px] text-zinc-600 dark:text-zinc-400">
                    이름·기간처럼 이벤트 기본 정보가 여기로 들어옵니다
                </p>
            </div>
        </>
    );
}
