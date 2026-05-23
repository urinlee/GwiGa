import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from 'storybook/test';
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logo = canvas.getByRole("link", { name: "GwiGa" });
    await expect(logo).toBeInTheDocument();
    await expect(logo).toHaveAttribute("href", "/");
    const themeButton = canvas.getByRole("button", { name: "테마 변경" });
    await expect(themeButton).toBeInTheDocument();
  },
};