import { expect, fn, userEvent, within } from 'storybook/test';
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExternalLink, Send, Trash2 } from "lucide-react";

import Button from "./Button";

const meta = {
  title: "Components/UI/Button",
  tags: ["autodocs"],
  component: Button,
  args: {
    onClick: fn(),
    children: "시작하기",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Variants ---

export const Primary: Story = {
  args: { variant: "primary" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "시작하기" });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "삭제" },
};

// --- Sizes ---

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

// --- Icons ---

export const IconLeft: Story = {
  args: {
    icon: <ExternalLink className="size-4" />,
    iconPosition: "left",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /시작하기/ }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const IconRight: Story = {
  args: {
    icon: <Send className="size-4" />,
    iconPosition: "right",
  },
};

// --- States ---

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
  },
};

export const DestructiveWithIcon: Story = {
  args: {
    variant: "destructive",
    children: "삭제",
    icon: <Trash2 className="size-4" />,
  },
};
