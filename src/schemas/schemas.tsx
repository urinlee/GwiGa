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

export const MemberNicknameSchema = z.object({
    nickname: z.string().min(0).max(20),
});
export type MemberNicknameForm = z.infer<typeof MemberNicknameSchema>;

// 멤버별 설정 필드 = 여기가 유일한 정의처. 나중엔 이 객체에만 추가하면 됨.
export const memberActiveSettingsSchema = z.object({
  enable: z.boolean(),
  startAt: z.coerce.date().nullable(),
  endAt: z.coerce.date().nullable(),
  // 나중: notify: z.boolean(),
  //       memo: z.string().max(200).nullable(),
});

// 한 항목 = 설정 + 어느 액티브냐(key)
export const memberActiveItemSchema = memberActiveSettingsSchema.extend({
  activeId: z.string(),
});

export const memberActivesSchema = z.object({
  actives: z.array(memberActiveItemSchema),
});

export type MemberActiveSettings = z.infer<typeof memberActiveSettingsSchema>;
export type MemberActiveItem = z.infer<typeof memberActiveItemSchema>;


export const groupNoticeSetSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요").max(100, "최대 100자까지 입력할 수 있어요"),
  content: z.string().trim().min(1, "내용을 입력하세요").max(2000, "최대 2000자까지 입력할 수 있어요"),
});
export type GroupNoticeForm = z.infer<typeof groupNoticeSetSchema>;