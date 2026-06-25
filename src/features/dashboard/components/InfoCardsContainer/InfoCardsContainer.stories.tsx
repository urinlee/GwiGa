import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import InfoCardsContainer, { stateType } from "./InfoCardsContainer";
import { ParticipateStatusProps } from "../ParticipateInfoCard/ParticipantsInfoCard";

const meta = {
    title: "Features/Dashboard/InfoCardsContainer",
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
            { username: "이우린",  userStatus: toUserStatus(["1", "2"]) },
            { username: "김민수",  userStatus: toUserStatus(["1", "2", "3", "4"]) },
            { username: "박지민",  userStatus: toUserStatus([]) },
            { username: "최수연",  userStatus: toUserStatus(["1"]) },
            { username: "정하늘",  userStatus: toUserStatus(["3", "4"]) },
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
    },
};

export const ManyParticipants: Story = {
    args: {
        allStatuses,
        participants: Array.from({ length: 30 }, (_, i) => ({
            username: `참가자${i + 1}`,
            userStatus: toUserStatus(
                allStatuses.filter(() => Math.random() > 0.5).map((s) => s.id)
            ),
        })),
    },
};
