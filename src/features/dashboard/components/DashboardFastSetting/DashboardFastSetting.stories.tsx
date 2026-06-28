import { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardFastSetting from "./DashboardFastSetting";

const meta = {
    title: "Features/Dashboard/DashboardFastSetting",
    component: DashboardFastSetting
    ,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
} satisfies Meta<typeof DashboardFastSetting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

    