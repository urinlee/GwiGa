import { redirect } from "next/navigation";

/** 이벤트 목록·상세에서 오는 링크가 이 주소로 들어온다. 사이드바가 켤 항목이 있어야 해서 일반으로 내려보낸다. */
export default async function EventSettingPage(props: PageProps<"/setting/event/[groupid]/[eventid]">) {
    const { groupid, eventid } = await props.params;
    redirect(`/setting/event/${encodeURIComponent(groupid)}/${encodeURIComponent(eventid)}/general`);
}
