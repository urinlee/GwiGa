import { expect, within } from 'storybook/test';
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateNewSection from "./CreateNewSection";

const meta = {
    title: "Features/RUOK/CreateNewSection",
    component: CreateNewSection,
} satisfies Meta<typeof CreateNewSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("새로운 일정을 추가해보세요!")).toBeInTheDocument();
        await expect(canvas.getByRole("link")).toHaveAttribute("href", expect.stringContaining("create"));
    },
};