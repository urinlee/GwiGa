import { Meta, StoryObj } from "@storybook/nextjs-vite";
import GetInput from "./GetInput";


const meta = {
    title: "Components/UI/GetInput",
    component: GetInput,
} satisfies Meta<typeof GetInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "이름",
        placeholder: "이름을 입력하세요",
        required: true,
        isLong: true,
        maxLength: 5
    },
}