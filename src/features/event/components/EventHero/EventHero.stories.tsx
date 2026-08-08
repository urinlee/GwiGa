import { expect, within } from "storybook/test";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "@/components/ui/Button/Button";
import { EventHero } from "./EventHero";

const meta = {
    title: "Features/Event/EventHero",
    component: EventHero,
    tags: ["autodocs"],
    // 실제와 같은 본문 폭으로 감싼다
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-4xl px-6">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof EventHero>;

export default meta;
type Story = StoryObj<typeof meta>;

// 날짜를 고정해 "오늘"에 따라 스토리가 흔들리지 않게 한다
const baseArgs = {
    groupId: "g1",
    name: "여름 정기 모임",
    status: "RECRUITING" as const,
    startAt: new Date("2026-08-15T18:00:00"),
    endAt: new Date("2026-08-15T21:00:00"),
    memberCount: 12,
    minMember: 10,
    maxMember: 30,
};

export const Default: Story = {
    args: baseArgs,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("heading", { name: "여름 정기 모임" })).toBeInTheDocument();
        await expect(canvas.getByRole("progressbar")).toBeInTheDocument();
    },
};

/** 참여하기 버튼을 붙인 실제 상세 화면 모습 */
export const WithAction: Story = {
    args: {
        ...baseArgs,
        action: <Button size="lg">참여하기</Button>,
    },
};

/** 세 가지 상태 — 달력 월 표기와 상태 점 색이 함께 바뀐다. */
export const Statuses: Story = {
    args: baseArgs,
    render: (args) => (
        <div className="flex flex-col gap-8">
            <EventHero {...args} status="RECRUITING" name="여름 정기 모임" />
            <EventHero {...args} status="ONGOING" name="가을 워크숍" />
            <EventHero {...args} status="CLOSED" name="봄 시즌 오픈" />
        </div>
    ),
};

/** 최소 인원을 넘긴 상태 — 게이지와 숫자가 초록으로 바뀐다. */
export const ReachedMin: Story = {
    args: { ...baseArgs, memberCount: 18 },
};

/** 정원이 가득 찬 상태 — 경고색으로 바뀐다. */
export const Full: Story = {
    args: { ...baseArgs, memberCount: 30, status: "ONGOING" as const },
};

/** 정원 제한이 없으면 게이지를 감춘다. */
export const NoCapacity: Story = {
    args: { ...baseArgs, minMember: null, maxMember: null, memberCount: 42 },
};

/** 일정이 안 잡힌 이벤트 — 달력이 "미정"으로 떨어진다. */
export const NoSchedule: Story = {
    args: { ...baseArgs, startAt: null, endAt: null },
};

/** 여러 날에 걸친 이벤트 — 달력엔 시작일, 아래 칸엔 기간 전체가 들어간다. */
export const MultiDay: Story = {
    args: {
        ...baseArgs,
        name: "가을 워크숍",
        startAt: new Date("2026-09-04T10:00:00"),
        endAt: new Date("2026-09-06T17:00:00"),
    },
};

/** 이름이 길어도 달력과 버튼을 밀어내지 않는다. */
export const LongTitle: Story = {
    args: {
        ...baseArgs,
        name: "여름 정기 모임 및 신입 회원 환영회 겸 하반기 계획 공유 자리",
        action: <Button size="lg">참여하기</Button>,
    },
};
