import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";
import { ExternalLink, Send } from "lucide-react";


const meta = {
    title: "Components/ui/Button",
    tags: ['autodocs'],
    component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoIcon: Story = {
    args: {
        title: "시작하기",
        callback: () => alert("Button Clicked!"),
    },
}

export const WithIcon: Story = {
    args: {
        title: "시작하기",
        callback: () => alert("Button Clicked!"),
        icon: <ExternalLink />
    },
}

export const OtherIcon : Story = {
    args: {
        title: "시작하기",
        callback: () => alert("Button Clicked!"),
        icon: <Send />
    },
}

