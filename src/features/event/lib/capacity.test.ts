import { describe, expect, it } from "vitest";

import { sumRecruitCapacity } from "./capacity";

describe("sumRecruitCapacity", () => {
    it("회차 정원을 모두 더한다", () => {
        expect(sumRecruitCapacity([{ capacity: 10 }, { capacity: 15 }])).toBe(25);
    });

    it("회차가 없으면 제한이 없다", () => {
        expect(sumRecruitCapacity([])).toBeNull();
    });

    it("정원을 비운 회차가 섞여 있으면 제한이 없다", () => {
        expect(sumRecruitCapacity([{ capacity: 10 }, { capacity: null }])).toBeNull();
    });

    it("정원을 비운 회차 하나뿐이어도 제한이 없다", () => {
        expect(sumRecruitCapacity([{ capacity: null }])).toBeNull();
    });

    it("정원이 0인 회차는 0으로 더한다 — 비운 것과 다르다", () => {
        expect(sumRecruitCapacity([{ capacity: 0 }, { capacity: 5 }])).toBe(5);
    });
});
