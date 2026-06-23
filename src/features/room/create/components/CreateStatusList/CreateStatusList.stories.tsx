import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateStatusList from "./CreateStatusList";


const meta = {
    title: "Features/Room/Create/Components/CreateStatusList",
    component: CreateStatusList,
} satisfies Meta<typeof CreateStatusList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        
    },
}