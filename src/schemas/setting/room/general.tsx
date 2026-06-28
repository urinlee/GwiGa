import { z } from "zod";

export const roomGeneralSetSchema = z.object({
    name: z.string().trim().min(1, "방 제목을 입력하세요").max(20, "최대 20자까지 입력할 수 있어요"),
    description: z.string().trim().max(2000, "최대 2000자까지 입력할 수 있어요"),

})
export type GeneralSettingForm = z.infer<typeof roomGeneralSetSchema>;