import { GroupActiveSettingsForm } from "@/features/setting/group/active/components/ActiveForm/ActiveForm";

export default async function GroupActiveSettingsPage({ params, searchParams, }: { params: Promise<{ groupid: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }>;}) {
    const { groupid } = await params;
    const {id, active} = await searchParams
    const eventId = typeof id === "string" ? id : undefined;
    const activeId = typeof active === "string" ? active : undefined;

    return (
        <div>
            <GroupActiveSettingsForm groupid={groupid} eventId={eventId || undefined} activeId={activeId}/>
        </div>
    );
}