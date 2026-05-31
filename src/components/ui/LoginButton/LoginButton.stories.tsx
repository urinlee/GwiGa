import { Meta, StoryObj } from "@storybook/nextjs-vite";
import loginButton from "./LoginButton";

const meta = {
    title: "Components/UI/LoginButton",
    tags: ["autodocs"],
    component: loginButton,
} satisfies Meta<typeof loginButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args:{
        text: "구글 계정으로 로그인",
        iconPath: "/login/google_icon.png",
        style: "bg-white text-gray-800 dark:bg-blue-700 dark:text-white",
    },
};
