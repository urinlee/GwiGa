import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardHero from "./DashboardHero";
import { expect, within } from 'storybook/test';

const meta = {
    title: "Features/Dashboard/DashboardHero",
    component: DashboardHero,
    tags: ["autodocs"],
    
} satisfies Meta<typeof DashboardHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        roomName: "과 개강총회",
        description: "과 개강총회입니다. 많은 참여 부탁드립니다!",
        date: "2026-10-01",
        time: "17:00 - 20:00",
        location: "쩡이포차",
        participantCount: 100,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText(args.roomName!)).toBeInTheDocument();
        await expect(canvas.getByText(args.description!)).toBeInTheDocument();
        await expect(canvas.getByText(`일정: ${args.date}`)).toBeInTheDocument();
        await expect(canvas.getByText(`시간: ${args.time}`)).toBeInTheDocument();
        await expect(canvas.getByText(`모집인원: ${args.participantCount}`)).toBeInTheDocument();
        await expect(canvas.getByText(`장소: ${args.location}`)).toBeInTheDocument();
    },
};