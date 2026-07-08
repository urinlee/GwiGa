import { RoomGeneralSettingsForm } from "@/features/setting/room/general/components/GeneralForm/GeneralForm";
import { RoomActiveSettingsForm } from "@/features/setting/room/state/components/ActiveForm/ActiveForm";
import { NewActiveButton } from "@/features/setting/room/state/components/NewActiveModal/NewActiveModal";
import { SelectActive } from "@/features/setting/room/state/components/SelectActive/SelectActive";
import { getGroup, isAdmin } from "@/services/group/group";
import { getUser } from "@/utils/currentUser";



export default async function RoomActiveSettingsPage({ params }: { params: Promise<{ roomid: string }> }) {
    const { roomid } = await params;
    const data = {
        name:"",
        description:"",
        primaryColor:"#000000",
        secondaryColor:"#FFFFFF"
    }



    return (
        <div>
            <NewActiveButton roomid={roomid} />
            <div className="h-4" />
            <RoomActiveSettingsForm roomid={roomid}/>
        </div>
    );
}