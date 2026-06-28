import { RoomGeneralSettingsForm } from "@/features/setting/room/general/components/GeneralForm/GeneralForm";


export default function RoomGeneralSettingsPage() {
    return (
        <>
            <RoomGeneralSettingsForm defaultValues={{ name: "", description: "" }} />
        </>
    );
}