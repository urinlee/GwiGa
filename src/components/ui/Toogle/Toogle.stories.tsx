import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toogle } from "./Toogle";


const meta = {
    title: "Components/UI/Toogle",
    component: Toogle,
} satisfies Meta<typeof Toogle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        checked: false,
        label: "알림 허용",
    },
};

export const Checked: Story = {
    args: {
        checked: true,
        label: "알림 허용",
    },
};

export const NOTChecked: Story = {
    args: {
        label: "알림 허용",
    },
};


export const Disabled: Story = {
    args: {
        checked: false,
        label: "비활성화됨",
        disabled: true,
    },
};