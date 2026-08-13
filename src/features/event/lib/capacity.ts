/**
 * 이벤트 정원은 컬럼이 아니라 회차(Recruit) 정원의 합이다.
 *
 * 회차 하나라도 정원을 비워두면 그 회차는 무제한이라, 합을 내는 순간
 * 실제보다 적은 수를 정원인 것처럼 보여주게 된다. 그런 경우는 제한 없음(null)으로 본다.
 */
export function sumRecruitCapacity(recruits: { capacity: number | null }[]): number | null {
    if (recruits.length === 0) return null;
    if (recruits.some((recruit) => recruit.capacity === null)) return null;

    return recruits.reduce((sum, recruit) => sum + (recruit.capacity ?? 0), 0);
}
