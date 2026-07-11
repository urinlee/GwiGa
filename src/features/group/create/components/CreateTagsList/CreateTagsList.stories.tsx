import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateTagsList from "./CreateTagsList";


const meta = {
    title: "Features/Group/Create/Components/CreateTagsList",
    component: CreateTagsList,
} satisfies Meta<typeof CreateTagsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        tags:["2026", "가천대", "스마트보안학과"]
    },
}