import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import ParticipantInfoCard, { ParticipateStatusProps } from "./ParticipantsInfoCard";

const meta = {
    title: "Features/Dashboard/ParticipantInfoCard",
    component: ParticipantInfoCard,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof ParticipantInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockStatuses: ParticipateStatusProps[] = [
    { id: "1", name: "입금", primaryColor: "#0d9488", secondaryColor: "#ccfbf1", isTrue: false },
    { id: "2", name: "도착", primaryColor: "#f97316", secondaryColor: "#ffedd5", isTrue: false },
    { id: "3", name: "귀가", primaryColor: "#a855f7", secondaryColor: "#f3e8ff", isTrue: false },
    { id: "4", name: "뒤풀이", primaryColor: "#ec4899", secondaryColor: "#fce7f3", isTrue: false },
];

const withEnabled = (ids: string[]) =>
    mockStatuses.map((s) => ({ ...s, isTrue: ids.includes(s.id) }));

export const NoStatus: Story = {
    args: {
        username: "이우린",
        userStatus: mockStatuses,
    },
};

export const PartialStatus: Story = {
    args: {
        username: "김민수",
        userStatus: withEnabled(["1", "2"]),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("김민수")).toBeInTheDocument();
        await expect(canvas.getByText("입금")).toBeInTheDocument();
    },
};

export const AllStatus: Story = {
    args: {
        username: "박지민",
        userStatus: withEnabled(["1", "2", "3", "4"]),
    },
};

export const LongUsername: Story = {
    args: {
        username: "이름이매우긴참가자입니다",
        userStatus: withEnabled(["1"]),
    },
};
