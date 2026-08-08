import { expect, within } from "storybook/test";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventAbout } from "./EventAbout";

const meta = {
    title: "Features/Event/EventAbout",
    component: EventAbout,
    tags: ["autodocs"],
    // 실제와 같은 레일 폭·구분선으로 감싼다
    decorators: [
        (Story) => (
            <div className="w-64 border-l border-zinc-200 pl-8 dark:border-zinc-800">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof EventAbout>;

export default meta;
type Story = StoryObj<typeof meta>;

const SHORT = "8월 정기 모임입니다. 저녁 식사 후 2차까지 예정되어 있어요.";

const LONG = `8월 정기 모임입니다. 저녁 식사 후 2차까지 예정되어 있어요.

신입 회원분들 소개와 하반기 활동 계획 공유가 함께 진행됩니다. 처음 오시는 분들도 부담 없이 오세요.

참가비는 별도 액티브에서 안내드릴 예정이고, 단체 티셔츠를 원하시는 분은 추가 신청을 받습니다. 메뉴는 사전 설문으로 미리 골라주시면 예약에 반영하겠습니다.

장소는 확정되는 대로 공지에 올리겠습니다. 문의는 운영진에게 편하게 주세요.`;

/** 짧아도 높이는 그대로 — 레일 높이가 글 길이에 따라 들쭉날쭉하지 않는다. */
export const Default: Story = {
    args: { description: SHORT },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = canvas.getByRole("region", { name: "이벤트 소개" });

        await expect(canvas.getByRole("heading", { name: "이벤트 소개" })).toBeInTheDocument();
        await expect(body.scrollHeight).toBeLessThanOrEqual(body.clientHeight);
    },
};

/** 고정 높이를 넘치면 영역 안에서 스크롤된다. */
export const Long: Story = {
    args: { description: LONG },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = canvas.getByRole("region", { name: "이벤트 소개" });

        await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    },
};

/** 줄바꿈은 원문 그대로 살린다 (마크다운이 아니라 textarea 입력이다). */
export const LineBreaks: Story = {
    args: { description: "준비물\n- 편한 신발\n- 우산\n\n집합 장소는 정문입니다." },
};

/** 설명이 없으면 레일 자체를 렌더하지 않는다 — 빈 높이가 남지 않는다. */
export const Empty: Story = {
    args: { description: null },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.queryByRole("heading")).not.toBeInTheDocument();
    },
};
