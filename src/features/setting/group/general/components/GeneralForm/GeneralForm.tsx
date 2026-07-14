"use client";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import CreateTagsList from "@/features/group/create/components/CreateTagsList/CreateTagsList";
import { SaveButton } from "@/features/setting/components/SaveButton/SaveButton";
import { GeneralSettingForm, groupGeneralSetSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";




export function GroupGeneralSettingsForm( {groupid, defaultValues}: { groupid: string, defaultValues: GeneralSettingForm }) {

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<GeneralSettingForm>({
        mode: "onChange",
        resolver: zodResolver(groupGeneralSetSchema),
        defaultValues,
    });

    const onSubmit = async (data: GeneralSettingForm) => {
        try {
            const response = await fetch(`/api/v1/group/${groupid}/setting/general`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update group settings");
            }

            // Optionally, you can handle the response data here
            const updatedGroup = await response.json();
            console.log("Group settings updated:", updatedGroup);


            reset(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <GetInputArea type="text" title="방 제목" description="방 제목을 입력하세요" required registration={register("name")} error={errors.name?.message} />
            <GetInputArea type="textarea" isLong={true} title="방 설명" description="방 설명을 입력하세요" registration={register("description")} error={errors.description?.message} />
            <GetInputArea type="number" title="인원 제한" description="최대 인원 수를 입력하세요" required registration={register("limit", { valueAsNumber: true })} error={errors.limit?.message} />
            {isDirty && <SaveButton isSubmitting={isSubmitting} />}
        </form>
    );
}