import type { EventStatus } from "@/generated/prisma/enums";

/** 목록·상세·설정이 같은 색을 쓴다. 화면을 옮겨도 상태 색이 이어진다. */
export const EVENT_STATUS: Record<EventStatus, { label: string; accent: string; live: boolean }> = {
    RECRUITING: { label: "모집중", accent: "#0F9D63", live: true },
    ONGOING: { label: "진행중", accent: "#2563eb", live: true },
    CLOSED: { label: "종료됨", accent: "#6B7280", live: false },
};
