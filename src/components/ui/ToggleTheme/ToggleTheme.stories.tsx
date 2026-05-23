import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from 'storybook/test';
import ToggleTheme from "./ToggleTheme";

const meta: Meta<typeof ToggleTheme> = {
  title: "Components/UI/ToggleTheme",
  component: ToggleTheme,
};

export default meta;
type Story = StoryObj<typeof ToggleTheme>;

export const ToggleThemeButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "테마 변경" });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // Button should still be in the DOM after clicking
    await expect(button).toBeInTheDocument();
  },
};
