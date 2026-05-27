import { StoryObj } from "@storybook/nextjs-vite";
import AuthorAvatar from "./AuthorAvatar";


const meta = {
    title: "Components/UI/AuthorAvatar",
    tags: ["autodocs"],
    component: AuthorAvatar,
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        imageUrl: "https://avatars.githubusercontent.com/u/109324792?v=4",
        description: "GwiGa",
        size: 12,
    },
};

export const NoImage: Story = {
    args: {
        description: "No Image",
        size: 12,
    },
};

export const CustomSize: Story = {
    args: {
        imageUrl: "https://avatars.githubusercontent.com/u/109324792?v=4",
        description: "Custom Size",
        size: 16,
    },
};

export const CustomSizeNoImage: Story = {
    args: {
        description: "Custom Size No Image",
        size: 16,
    },
};

