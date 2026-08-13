const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** "9월 1일 (화)" */
export function formatDate(date: Date): string {
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}

/** "오후 6:00" — 24시간 값을 오전/오후 12시간제로 바꾼다. */
export function formatTime(date: Date): string {
    const hours = date.getHours();
    const period = hours < 12 ? "오전" : "오후";
    // 0시·12시는 12로 표기한다 (0:00 → 오전 12:00, 12:00 → 오후 12:00)
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${period} ${hour12}:${date.getMinutes().toString().padStart(2, "0")}`;
}

/** 시각을 무시하고 같은 날짜인지 본다. */
export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/** "8/10 – 8/14" — 좁은 칸에 기간을 한 줄로 넣어야 할 때 */
export function formatShortPeriod(startAt?: Date | null, endAt?: Date | null): string {
    const short = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    if (!startAt && !endAt) return "기간 미정";
    if (startAt && !endAt) return `${short(startAt)}부터`;
    if (!startAt && endAt) return `${short(endAt)}까지`;
    const s = startAt as Date;
    const e = endAt as Date;
    return isSameDay(s, e) ? short(s) : `${short(s)} – ${short(e)}`;
}

/** 오늘 자정 기준 남은 일수. 지났으면 음수. */
export function daysUntil(date: Date, now: Date = new Date()): number {
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);
}

/** startAt·endAt이 둘 다 nullable이라 네 경우를 모두 다룬다. */
export function formatPeriod(startAt?: Date | null, endAt?: Date | null): { date: string; time?: string } {
    if (!startAt && !endAt) return { date: "일정 미정" };
    if (startAt && !endAt) return { date: formatDate(startAt), time: `${formatTime(startAt)}부터` };
    if (!startAt && endAt) return { date: `${formatDate(endAt)}까지` };

    const s = startAt as Date;
    const e = endAt as Date;
    // 같은 날이면 날짜 한 번 + 시간 범위, 다른 날이면 날짜끼리 잇는다
    return isSameDay(s, e)
        ? { date: formatDate(s), time: `${formatTime(s)} ~ ${formatTime(e)}` }
        : { date: `${formatDate(s)} ~ ${formatDate(e)}` };
}
