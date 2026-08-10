import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NewActiveModal } from "./NewActiveModal";

const meta = {
  title: 'Features/Setting/Group/Active/NewActiveModal',
  component: NewActiveModal,
} satisfies Meta<typeof NewActiveModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupid: 'example-group-id',
    isOpen: true,
    setIsOpen: () => {},
  },
};