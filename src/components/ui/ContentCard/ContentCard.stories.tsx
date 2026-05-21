import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentCard from "./ContentCard";

const meta = {
    title: "Components/UI/ContentCard",
    tags: ["autodocs"],
    component: ContentCard,
} satisfies Meta<typeof ContentCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "ContentCard",
    },
};

export const DottedBorder: Story = {
    args: {
        children: <div className="w-full text-center">추가하기</div>,
        style: "border-dashed border-2 border-zinc-900 dark:border-zinc-600",
    }
}