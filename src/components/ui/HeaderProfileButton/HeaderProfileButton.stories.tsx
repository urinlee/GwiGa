import { Meta, StoryObj } from "@storybook/nextjs-vite";
import HeaderProfileButton from "./HeaderProfileButton";


const meta = {
  title: "Components/UI/HeaderProfileButton",
  component: HeaderProfileButton,
} satisfies Meta<typeof HeaderProfileButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    menuAlign: "left",
  },
};
