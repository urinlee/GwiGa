import Home from "@/app/(main)/page";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
    title: "Page/Home",
    component: Home
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
