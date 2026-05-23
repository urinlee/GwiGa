import { expect, within } from 'storybook/test';
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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("ContentCard")).toBeInTheDocument();
        await expect(canvas.getByRole("article")).toBeInTheDocument();
    },
};

export const DottedBorder: Story = {
    args: {
        children: <div className="w-full text-center">추가하기</div>,
        style: "border-dashed border-2 border-zinc-900 dark:border-zinc-600",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("추가하기")).toBeInTheDocument();
    },
};