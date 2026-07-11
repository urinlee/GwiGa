import { z } from "zod";

export const groupGeneralSetSchema = z.object({
    name: z.string().trim().min(1, "방 제목을 입력하세요").max(20, "최대 20자까지 입력할 수 있어요"),
    description: z.string().trim().max(2000, "최대 2000자까지 입력할 수 있어요"),
    limit: z.number().min(1, "최소 1명 이상이어야 합니다").max(1000, "최대 1000명까지 가능합니다"),
})
export type GeneralSettingForm = z.infer<typeof groupGeneralSetSchema>;


export const groupActiveSetSchema = z.object({
    name: z.string().trim().min(1, "액티브 이름을 입력하세요").max(10, "최대 10자까지 입력할 수 있어요"),
    description: z.string().trim().max(2000, "최대 2000자까지 입력할 수 있어요"),
    primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "유효한 색상 코드를 입력하세요"),
    secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "유효한 색상 코드를 입력하세요"),

})
export type ActiveSettingForm = z.infer<typeof groupActiveSetSchema>;