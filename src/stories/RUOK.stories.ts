import RUOK from "@/app/(main)/my/page";
import { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta = {
    title: "Page/RUOK",
    component: RUOK,
} satisfies Meta<typeof RUOK>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

