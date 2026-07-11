import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import DashboardHero from "./DashboardHero";

const meta = {
    title: "Features/Dashboard/DashboardHero",
    component: DashboardHero,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
} satisfies Meta<typeof DashboardHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        groupName: "과 개강총회",
        description: "과 개강총회입니다. 많은 참여 부탁드립니다!",
        date: "2026-10-01",
        tags: "17:00 - 20:00",
        location: "쩡이포차",
        participantCount: 100,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText(args.groupName!)).toBeInTheDocument();
        await expect(canvas.getByText(args.description!)).toBeInTheDocument();
    },
};

export const Defaults: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("새로운 방")).toBeInTheDocument();
    },
};

export const LongDescription: Story = {
    args: {
        groupName: "송년회",
        description: "올 한 해도 수고 많으셨습니다! 연말을 맞아 함께 모여 한 해를 마무리하는 자리를 마련했습니다. 많은 참여 부탁드립니다. 장소는 추후 공지 예정입니다.",
        date: "2026-12-31",
        tags: "19:00 - 23:00",
        location: "미정",
        participantCount: 50,
    },
};
