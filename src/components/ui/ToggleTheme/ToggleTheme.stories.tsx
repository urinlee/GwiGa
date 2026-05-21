import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ToggleTheme from "./ToggleTheme";

const meta: Meta<typeof ToggleTheme> = {
  title: "Components/UI/ToggleTheme",
  component: ToggleTheme,
};

export default meta;
type Story = StoryObj<typeof ToggleTheme>;

export const ToggleThemeButton: Story = {};
