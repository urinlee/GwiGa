import type { RecruitStatus } from "@/generated/prisma/enums";

/** status(관리자가 연·닫은 상태)와 기간을 합쳐 화면에 보일 단계를 정한다. */
export type RecruitPhase = "예정" | "모집중" | "마감";

export function deriveRecruitPhase(
    status: RecruitStatus,
    startAt?: Date | null,
    endAt?: Date | null,
    now: Date = new Date(),
): RecruitPhase {
    if (status === "CLOSED") return "마감";
    if (endAt && now.getTime() > endAt.getTime()) return "마감";
    if (startAt && now.getTime() < startAt.getTime()) return "예정";
    return "모집중";
}

/** 카드·상세가 함께 쓰는 회차 읽기 모델. userCount는 APPLIED만 센 값이다. */
export interface Recruit {
    id: string;
    status: RecruitStatus;
    title?: string | null;
    description?: string | null;
    startAt?: Date | null;
    endAt?: Date | null;
    userCount: number;
    userMaxCount?: number | null;
}
