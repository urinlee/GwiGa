import { expect, within } from 'storybook/test';
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ParticipantInfoCard from "./ParticipantsInfoCard";


const meta = {
    title: "Features/Dashboard/ParticipateInfoCard",
    component: ParticipantInfoCard,
    
} satisfies Meta<typeof ParticipantInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args:{
        username: "이우린",
        enableStatus: [],
        allStatus: []
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText(args.username!)).toBeInTheDocument();
    },
};

export const WithStatus: Story = {
    args:{
        username: "이우린",
        enableStatus: ["입금", "도착"],
        allStatus: ["입금", "도착", "귀가", "뒤풀이"]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("이우린")).toBeInTheDocument();
        // All statuses from allStatus should be rendered
        await expect(canvas.getByText("입금")).toBeInTheDocument();
        await expect(canvas.getByText("도착")).toBeInTheDocument();
        await expect(canvas.getByText("귀가")).toBeInTheDocument();
        await expect(canvas.getByText("뒤풀이")).toBeInTheDocument();
    },
};

export const WithCustomStatus: Story = {
    args:{
        username: "이우린",
        enableStatus: ["입금", "도착"],
        allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Custom status "몰라" should also be rendered (even though it's not in participateStatusClasses)
        await expect(canvas.getByText("몰라")).toBeInTheDocument();
        await expect(canvas.getByText("입금")).toBeInTheDocument();
    },
};

export const WithCustomStatusEnable: Story = {
    args:{
        username: "이우린",
        enableStatus: ["입금", "도착", "몰라"],
        allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("이우린")).toBeInTheDocument();
        await expect(canvas.getByText("몰라")).toBeInTheDocument();
    },
};