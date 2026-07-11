import { GroupActiveSettingsForm } from "@/features/setting/group/active/components/ActiveForm/ActiveForm";
import { NewActiveButton } from "@/features/setting/group/active/components/NewActiveModal/NewActiveModal";

export default async function GroupActiveSettingsPage({ params }: { params: Promise<{ groupid: string }> }) {
    const { groupid } = await params;

    return (
        <div>
            <NewActiveButton groupid={groupid} />
            <div className="h-4" />
            <GroupActiveSettingsForm groupid={groupid} />
        </div>
    );
}