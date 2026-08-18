import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import InfoCardsContainer from "./InfoCardsContainer";
import type { ParticipateStatusProps, stateType } from "./types";

const meta = {
    title: "UI/InfoCardsContainer",
    component: InfoCardsContainer,
    tags: ["autodocs"],
} satisfies Meta<typeof InfoCardsContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const allStatuses: stateType[] = [
    { id: "1", name: "입금", primaryColor: "#0d9488", secondaryColor: "#ccfbf1" },
    { id: "2", name: "도착", primaryColor: "#f97316", secondaryColor: "#ffedd5" },
    { id: "3", name: "귀가", primaryColor: "#a855f7", secondaryColor: "#f3e8ff" },
    { id: "4", name: "뒤풀이", primaryColor: "#ec4899", secondaryColor: "#fce7f3" },
];

const toUserStatus = (enabledIds: string[]): ParticipateStatusProps[] =>
    allStatuses.map((s) => ({ ...s, isTrue: enabledIds.includes(s.id) }));

export const Default: Story = {
    args: {
        allStatuses,
        participants: [
            { memberId: "m-1", username: "이우린",  userStatus: toUserStatus(["1", "2"]) },
            { memberId: "m-2", username: "김민수",  userStatus: toUserStatus(["1", "2", "3", "4"]) },
            { memberId: "m-3", username: "박지민",  userStatus: toUserStatus([]) },
            { memberId: "m-4", username: "최수연",  userStatus: toUserStatus(["1"]) },
            { memberId: "m-5", username: "정하늘",  userStatus: toUserStatus(["3", "4"]) },
        ],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("이우린")).toBeInTheDocument();
        await expect(canvas.getByText("박지민")).toBeInTheDocument();
    },
};

export const Empty: Story = {
    args: {
        allStatuses,
        participants: [],
        emptyMessage: "아직 이 이벤트에 참가한 사람이 없어요",
    },
};

/** 이벤트 상세처럼 다른 섹션 아래에 붙일 때. 제목줄과 바깥 여백을 쓰는 쪽이 정한다. */
export const WithTitle: Story = {
    args: {
        title: "참가자",
        allStatuses,
        className: "border-t border-zinc-200 pt-8 dark:border-zinc-800",
        participants: [
            { memberId: "m-1", username: "이우린", userStatus: toUserStatus(["1", "2"]) },
            { memberId: "m-5", username: "정하늘", userStatus: toUserStatus(["3", "4"]) },
        ],
    },
};

export const ManyParticipants: Story = {
    args: {
        allStatuses,
        participants: Array.from({ length: 30 }, (_, i) => ({
            memberId: `m-${i + 1}`,
            username: `참가자${i + 1}`,
            userStatus: toUserStatus(
                allStatuses.filter(() => Math.random() > 0.5).map((s) => s.id)
            ),
        })),
    },
};
