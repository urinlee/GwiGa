import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateNewSection from "./CreateNewSection";

const meta = {
    title: "Features/RUOK/CreateNewSection",
    component: CreateNewSection,
} satisfies Meta<typeof CreateNewSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "과 개강총회",
        date: "2024-06-01",
        status: "예정"
    }
};