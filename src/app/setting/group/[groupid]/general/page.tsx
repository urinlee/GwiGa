import { GroupGeneralSettingsForm } from "@/features/setting/group/general/components/GeneralForm/GeneralForm";
import { getGroup, isAdmin } from "@/services/group/group";
import { getUser } from "@/utils/currentUser";



export default async function GroupGeneralSettingsPage({ params }: { params: Promise<{ groupid: string }> }) {
    const { groupid } = await params;
    const data = await getGroup(groupid);


    return (
        <>
            <GroupGeneralSettingsForm groupid={groupid} defaultValues={{ name: data?.name || "", description: data?.description || "", limit: data?.limit || 1 }} />
        </>
    );
}