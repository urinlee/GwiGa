import MyPage from "@/app/(main)/my/page";
import { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta = {
    title: "Page/MyPage",
    component: MyPage,
} satisfies Meta<typeof MyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

