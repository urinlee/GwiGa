import type { Meta, StoryObj } from "@storybook/react";
import { SaveButton } from "./SaveButton";

const meta = {
    title: "Features/Setting/components/SaveButton",
    component: SaveButton,
} satisfies Meta<typeof SaveButton>;

export default meta;

type Story = StoryObj<typeof SaveButton>;

export const Default: Story = {
    args: {
        isSubmitting: false,
    },
};