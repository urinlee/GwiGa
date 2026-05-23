import { expect, fn, userEvent, within } from 'storybook/test';
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExternalLink, Send } from "lucide-react";

import Button from "./Button";

const meta = {
  title: "Components/UI/Button",
  tags: ["autodocs"],
  component: Button,
  args: {
    callback: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoIcon: Story = {
  args: {
    title: "시작하기",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "시작하기" });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.callback).toHaveBeenCalledTimes(1);
  },
};

export const WithIcon: Story = {
  args: {
    title: "시작하기",
    icon: <ExternalLink />,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /시작하기/ });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.callback).toHaveBeenCalledTimes(1);
  },
};

export const OtherIcon: Story = {
  args: {
    title: "시작하기",
    icon: <Send />,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /시작하기/ });
    await userEvent.click(button);
    await expect(args.callback).toHaveBeenCalledTimes(1);
  },
};

export const NoCallback: Story = {
  args: {
    title: "콜백없음",
    callback: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "콜백없음" });
    // Should render without throwing when no callback is provided
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
  },
};
