"use client";
import { ActiveSettingForm } from "@/schemas/setting/room/schemas";
import { useForm } from "react-hook-form";


export function RoomActiveSettingsForm({ roomid, defaultValues }: { roomid: string, defaultValues: ActiveSettingForm }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ActiveSettingForm>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit = async (data: ActiveSettingForm) => {}

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

        </form>
    )
}