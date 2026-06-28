"use client";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { SaveButton } from "@/features/setting/components/SaveButton/SaveButton";
import { GeneralSettingForm, roomGeneralSetSchema } from "@/schemas/setting/room/general";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";




export function RoomGeneralSettingsForm( {defaultValues}: { defaultValues: GeneralSettingForm }) {

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<GeneralSettingForm>({
        mode: "onChange",
        resolver: zodResolver(roomGeneralSetSchema),
        defaultValues,
    });

    return (
        <form>
            <GetInputArea type="text" title="방 제목" description="방 제목을 입력하세요" required registration={register("name")} error={errors.name?.message} />
            <GetInputArea type="textarea" isLong={true} title="방 설명" description="방 설명을 입력하세요" registration={register("description")} error={errors.description?.message} />
            {isDirty && <SaveButton isSubmitting={isSubmitting} />}
        </form>
    );
}