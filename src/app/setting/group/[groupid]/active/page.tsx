import { GroupActiveSettingsForm } from "@/features/setting/group/active/components/ActiveForm/ActiveForm";

export default async function GroupActiveSettingsPage({ params }: { params: Promise<{ groupid: string }> }) {
    const { groupid } = await params;

    return (
        <div>
            <GroupActiveSettingsForm groupid={groupid} />
        </div>
    );
}