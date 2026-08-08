import { expect, userEvent, within } from "storybook/test";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventActiveCard, EventActives } from "./EventActives";

const meta = {
    title: "Features/Event/EventActives",
    component: EventActiveCard,
    tags: ["autodocs"],
} satisfies Meta<typeof EventActiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// phase를 명시해 "오늘"에 따라 스토리가 흔들리지 않게 한다
const baseArgs = {
    name: "참가비 납부",
    description: "8월 정기 모임 참가비 3만원을 입금해 주세요.",
    type: "PAYMENT" as const,
    primaryColor: "#2563eb",
    startAt: new Date("2026-08-01T09:00:00"),
    endAt: new Date("2026-08-31T18:00:00"),
    userCount: 12,
    userMaxCount: 30,
    phase: "진행중" as const,
};

export const Default: Story = {
    args: baseArgs,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("heading", { name: "참가비 납부" })).toBeInTheDocument();

        // 접힌 상태로 시작해서 클릭하면 상세가 열린다
        const toggle = canvas.getByRole("button");
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await userEvent.click(toggle);
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
    },
};

/** 상세를 펼친 상태 — 기간·참여 현황과 게이지가 보인다. */
export const Expanded: Story = {
    args: baseArgs,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByRole("button"));
        await expect(canvas.getByRole("progressbar")).toBeInTheDocument();
    },
};

/** 기간으로 파생되는 세 가지 상태 */
export const Phases: Story = {
    args: baseArgs,
    render: (args) => (
        <div className="flex flex-col gap-3">
            <EventActiveCard {...args} name="사전 설문" phase="예정" />
            <EventActiveCard {...args} name="참가비 납부" phase="진행중" />
            <EventActiveCard {...args} name="1차 모집 설문" phase="종료" />
        </div>
    ),
};

/** 액티브 타입별 아이콘·뱃지 */
export const Types: Story = {
    args: baseArgs,
    render: (args) => (
        <div className="flex flex-col gap-3">
            <EventActiveCard {...args} name="출석 체크" description="현장에서 관리자가 확인합니다." type="MANUAL" primaryColor="#71717a" />
            <EventActiveCard {...args} name="참가비 납부" type="PAYMENT" primaryColor="#2563eb" />
            <EventActiveCard {...args} name="메뉴 사전 조사" description="드실 메뉴를 미리 골라주세요." type="SURVEY" primaryColor="#16a34a" />
        </div>
    ),
};

/** 정원이 가득 찬 액티브 — 인원과 게이지가 경고색으로 바뀐다. */
export const Full: Story = {
    args: { ...baseArgs, userCount: 30, userMaxCount: 30 },
};

/** 정원 제한이 없는 액티브 — 게이지 없이 참여 인원만 표시한다. */
export const NoCapacity: Story = {
    args: { ...baseArgs, userCount: 42, userMaxCount: undefined },
};

/** 기간이 지정되지 않은 액티브 */
export const NoSchedule: Story = {
    args: { ...baseArgs, startAt: null, endAt: null, phase: undefined },
};

/** 시작·종료가 같은 날이면 날짜 한 번 + 시간 범위로 접힌다. */
export const SameDay: Story = {
    args: {
        ...baseArgs,
        startAt: new Date("2026-08-15T18:00:00"),
        endAt: new Date("2026-08-15T21:00:00"),
    },
};

/** 이름·설명이 길어도 뱃지를 밀어내지 않는다. */
export const LongText: Story = {
    args: {
        ...baseArgs,
        name: "여름 정기 모임 참가비 및 굿즈 사전 구매 대금 납부",
        description:
            "참가비 3만원과 단체 티셔츠 구매를 원하시는 분은 추가로 1만 5천원을 함께 입금해 주시면 됩니다. 입금자명은 본인 이름으로 부탁드려요.",
    },
};

/** children으로 결제·설문 모듈 UI를 상세 영역에 끼워 넣을 수 있다. */
export const WithDetailSlot: Story = {
    args: {
        ...baseArgs,
        children: (
            <div className="mt-4 rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <p className="font-semibold">입금 계좌</p>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">국민 123456-78-901234 · 30,000원</p>
            </div>
        ),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByRole("button"));
        await expect(canvas.getByText("입금 계좌")).toBeInTheDocument();
    },
};

/** 이벤트 상세에서 쓰이는 목록 전체 */
export const List: Story = {
    args: baseArgs,
    render: () => (
        <EventActives
            actives={[
                {
                    id: "1",
                    name: "참가비 납부",
                    description: "8월 정기 모임 참가비 3만원을 입금해 주세요.",
                    type: "PAYMENT",
                    primaryColor: "#2563eb",
                    startAt: new Date("2026-08-01T09:00:00"),
                    endAt: new Date("2026-08-31T18:00:00"),
                    userCount: 12,
                    userMaxCount: 30,
                    phase: "진행중",
                },
                {
                    id: "2",
                    name: "메뉴 사전 조사",
                    description: "드실 메뉴를 미리 골라주세요.",
                    type: "SURVEY",
                    primaryColor: "#16a34a",
                    startAt: new Date("2026-08-10T00:00:00"),
                    endAt: new Date("2026-08-20T23:59:00"),
                    userCount: 8,
                    userMaxCount: 8,
                    phase: "종료",
                },
                {
                    id: "3",
                    name: "출석 체크",
                    type: "MANUAL",
                    primaryColor: "#f59e0b",
                    startAt: null,
                    endAt: null,
                    userCount: 0,
                    phase: "예정",
                },
            ]}
        />
    ),
};

/** 액티브가 하나도 없을 때 */
export const EmptyList: Story = {
    args: baseArgs,
    render: () => <EventActives actives={[]} />,
};
