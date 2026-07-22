interface SettlementData {
    collected: number;
    spent: number;
}

interface SettlementDashboardProps {
    total: SettlementData;
    lastMonth: SettlementData;
    fixedMonthly: SettlementData;
    person: {
        min: number;
        max: number;
    };
}

const won = (n: number) => n.toLocaleString("ko-KR");

/**
 * 금액 + "원" 단위.
 * 단위를 em으로 잡아 히어로(8xl)든 보조(4xl)든 숫자 대비 비율이 유지된다.
 */
function Amount({ value }: { value: number }) {
    return (
        <>
            {won(value)}
            <span className="ml-[0.14em] text-[0.32em] font-normal text-zinc-500 dark:text-zinc-400">원</span>
        </>
    );
}

/** 하위 지표 한 칸 — 라벨 위(작고 흐리게), 값 아래(크고 진하게) */
function Metric({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <dt className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
            <dd className="mt-0.5 text-base font-medium tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                {won(value)}
            </dd>
        </div>
    );
}

interface StatBlockProps {
    label: string;
    value: number;
    hero?: boolean;
    children?: React.ReactNode;
}

/**
 * 주요 블록 — 라벨 → 큰 숫자 → 하위 지표.
 *
 * 카드가 없으므로 "하위 지표가 이 숫자에 속한다"를 위치로만 알려야 한다.
 *  - pl-6  : 들여쓰기. 부모보다 안쪽에서 시작해야 자식으로 읽힌다.
 *  - max-w : 폭을 잘라 전체 폭을 채우지 않게 한다. 꽉 차면 형제 행처럼 보인다.
 *  - mt-5  : 부모와는 가깝게. 블록 사이 간격(gap-20)의 1/4 이하로 유지한다.
 */
function StatBlock({ label, value, hero = false, children }: StatBlockProps) {
    return (
        <section>
            <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-50">{label}</h2>
            <p
                className={[
                    "mt-1.5 tracking-tight tabular-nums",
                    hero ? "text-6xl font-light sm:text-7xl lg:text-8xl" : "text-4xl font-normal sm:text-5xl",
                    "text-zinc-900 dark:text-zinc-50",
                ].join(" ")}
            >
                <Amount value={value} />
            </p>
            {children && (
                <dl
                    className={`mt-5 grid gap-x-8 gap-y-4 pl-6 ${
                        hero ? "max-w-lg grid-cols-4" : "max-w-[15rem] grid-cols-2"
                    }`}
                >
                    {children}
                </dl>
            )}
        </section>
    );
}

export function SettlementDashboard({
    total,
    lastMonth,
    fixedMonthly,
    person,
}: SettlementDashboardProps) {
    return (
        // 보더가 없으니 그룹 구분은 여백이 전담한다.
        // 블록 사이(gap-y-20 = 80px) >> 블록 안(mt-5 = 20px) — 4배 차이가 나야 덩어리로 읽힌다.
        <div className="grid gap-x-16 gap-y-20 py-10 lg:grid-cols-2">
            <div className="lg:col-span-2">
                <StatBlock label="충당금" value={total.collected} hero>
                    <Metric label="총 지출 금액" value={total.collected} />
                    <Metric label="총 모인 금액" value={total.spent} />
                </StatBlock>
            </div>

            <StatBlock label="최근 30일" value={lastMonth.spent}>
                <Metric label="지출" value={lastMonth.spent} />
                <Metric label="수입" value={lastMonth.collected} />
            </StatBlock>

            {/* 큰 숫자는 월 기준. 매일·매주는 하위로 빼서 중복을 없앤다 */}
            <StatBlock label="이번 달 모일 금액" value={fixedMonthly.collected}>
                <Metric label="인당 최저 금액" value={person.min} />
                <Metric label="인당 최고 금액" value={person.max} />
            </StatBlock>
        </div>
    );
}
