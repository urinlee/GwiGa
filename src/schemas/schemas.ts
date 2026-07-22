import { z } from "zod";
import { ActiveType, EventStatus } from "@/generated/prisma/enums";

/** 빈 문자열 → null. FK에 ""가 들어가는 것과, 수정 시 "지우기"가 "안 바꿈"이 되는 것을 둘 다 막는다. */
const optionalId = z
    .string()
    .nullish()
    .transform((v) => (v && v.trim() !== "" ? v : null));

// ─── 그룹 ────────────────────────────────────────────────

export const groupGeneralSchema = z.object({
    name: z.string().trim().min(1, "방 제목을 입력하세요").max(20, "최대 20자까지 입력할 수 있어요"),
    description: z.string().trim().max(2000, "최대 2000자까지 입력할 수 있어요"),
    limit: z
        .number()
        .int("정수로 입력하세요")
        .min(1, "최소 1명 이상이어야 합니다")
        .max(1000, "최대 1000명까지 가능합니다"),
});
export type GroupGeneralFormValues = z.infer<typeof groupGeneralSchema>;

export const groupNoticeSchema = z.object({
    title: z.string().trim().min(1, "제목을 입력하세요").max(100, "최대 100자까지 입력할 수 있어요"),
    content: z.string().trim().min(1, "내용을 입력하세요").max(10000, "최대 10000자까지 입력할 수 있어요"),
    badgeId: optionalId,
});
// transform이 있으면 입력·출력 타입이 다르다. 폼은 input, parse 결과는 output.
export type GroupNoticeFormValues = z.input<typeof groupNoticeSchema>;
export type GroupNoticeInput = z.output<typeof groupNoticeSchema>;

// ─── 이벤트 ──────────────────────────────────────────────

/** refine을 붙이면 extend·partial을 못 쓴다. 변형이 필요하면 이쪽에서 파생시킬 것. */
export const eventBaseSchema = z.object({
    name: z.string().trim().min(1, "이벤트 이름을 입력하세요").max(50, "최대 50자까지 입력할 수 있어요"),
    description: z.string().trim().max(6000, "최대 6000자까지 입력할 수 있어요").optional(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    status: z.enum(EventStatus).optional(),
});

export const eventSchema = eventBaseSchema.refine((d) => d.startAt < d.endAt, {
    message: "종료 시각은 시작 시각보다 늦어야 해요",
    path: ["endAt"],
});
export type EventFormValues = z.infer<typeof eventSchema>;

// ─── 액티브 ──────────────────────────────────────────────

export const activeSchema = z.object({
    name: z.string().trim().min(1, "액티브 이름을 입력하세요").max(30, "최대 30자까지 입력할 수 있어요"),
    description: z.string().trim().max(2000, "최대 2000자까지 입력할 수 있어요"),
    primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "유효한 색상 코드를 입력하세요"),
    secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "유효한 색상 코드를 입력하세요"),

    // Prisma에서 전부 기본값이 있거나 nullable이라 폼이 안 보내도 된다.
    type: z.enum(ActiveType).optional(),
    selfServe: z.boolean().optional(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    eventId: optionalId,
    prerequisiteId: optionalId,
});
export type ActiveFormValues = z.input<typeof activeSchema>;
export type ActiveInput = z.output<typeof activeSchema>;

// ─── 멤버 ────────────────────────────────────────────────

export const memberNicknameSchema = z.object({
    // 빈 문자열 = 닉네임 해제. 라우트가 유저 본명으로 되돌리므로 min을 걸지 않는다.
    nickname: z.string().trim().max(20, "최대 20자까지 입력할 수 있어요"),
});
export type MemberNicknameFormValues = z.infer<typeof memberNicknameSchema>;

/** 멤버별 액티브 설정 필드의 유일한 정의처. 필드가 늘면 여기에만 추가한다. */
export const memberActiveSchema = z.object({
    enable: z.boolean(),
    startAt: z.coerce.date().nullable(),
    endAt: z.coerce.date().nullable(),
});
export type MemberActiveFormValues = z.infer<typeof memberActiveSchema>;

export const memberActiveItemSchema = memberActiveSchema
    .extend({ activeId: z.string().min(1) })
    .refine((d) => !d.startAt || !d.endAt || d.startAt < d.endAt, {
        message: "종료일은 시작일보다 늦어야 해요",
        path: ["endAt"],
    });
export type MemberActiveItem = z.infer<typeof memberActiveItemSchema>;

export const memberActivesSchema = z.object({
    actives: z.array(memberActiveItemSchema),
});
export type MemberActivesPayload = z.infer<typeof memberActivesSchema>;
