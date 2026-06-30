import { RoomGeneralSettingsForm } from "@/features/setting/room/general/components/GeneralForm/GeneralForm";
import { getGroup, isAdmin } from "@/services/group/group";
import { getUser } from "@/utils/currentUser";



export default async function RoomGeneralSettingsPage({ params }: { params: Promise<{ roomid: string }> }) {
    const { roomid } = await params;
    const data = await getGroup(roomid);


    return (
        <>
            <RoomGeneralSettingsForm roomid={roomid} defaultValues={{ name: data?.name || "", description: data?.description || "", limit: data?.limit || 1 }} />
        </>
    );
}