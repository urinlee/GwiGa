import { describe, expect, it } from "vitest";

import { deriveRecruitPhase } from "./recruit";

const NOW = new Date("2026-08-14T12:00:00.000Z");
const day = (offset: number) => new Date(NOW.getTime() + offset * 86_400_000);

describe("deriveRecruitPhase", () => {
    it("관리자가 닫았으면 기간과 무관하게 마감이다", () => {
        expect(deriveRecruitPhase("CLOSED", day(-1), day(3), NOW)).toBe("마감");
    });

    it("종료일이 지났으면 열려 있어도 마감이다", () => {
        expect(deriveRecruitPhase("OPEN", day(-10), day(-1), NOW)).toBe("마감");
    });

    it("시작 전이면 예정이다", () => {
        expect(deriveRecruitPhase("OPEN", day(2), day(9), NOW)).toBe("예정");
    });

    it("기간 안이면 모집중이다", () => {
        expect(deriveRecruitPhase("OPEN", day(-1), day(3), NOW)).toBe("모집중");
    });

    it("기간을 안 정했으면 열려 있는 동안 모집중이다", () => {
        expect(deriveRecruitPhase("OPEN", null, null, NOW)).toBe("모집중");
    });
});
