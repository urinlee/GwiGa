import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SettlementDashboard } from "./SettlementDashboard";

const meta = {
    title: 'Features/Settlement/Components/SettlementDashboard',
    component: SettlementDashboard,
    tags: ['autodocs'],
} satisfies Meta<typeof SettlementDashboard>;

export default meta;

export const Default: StoryObj<typeof SettlementDashboard> = {
    args: {
        total: { collected: 1000, spent: 500 },
        lastMonth: { collected: 3000, spent: 1500 },
        person: { min: 100, max: 500 },
        fixedMonthly: { collected: 1500, spent: 750 },
    },
};