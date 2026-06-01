import { Meta, StoryObj } from "@storybook/nextjs-vite";
import HeaderProfileMenu from "./HeaderProfileMenu";

const meta = {
    title: "Components/UI/HeaderProfileMenu",
    component: HeaderProfileMenu,
} satisfies Meta<typeof HeaderProfileMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};