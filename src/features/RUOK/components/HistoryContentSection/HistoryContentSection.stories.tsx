import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryContentSection } from "./HistoryContentSection";

const meta = {
    title: "Features/RUOK/HistoryContentSection",
    component: HistoryContentSection,
} satisfies Meta<typeof HistoryContentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "과 개강총회",
        date: "2024-06-01",
        status: "예정"
    }
};

export const haveRedirectUrl: Story = {
    args: {
        title: "과 개강총회",
        date: "2024-06-01",
        status: "예정",
        redirectUrl: "/some-url"
    }
};