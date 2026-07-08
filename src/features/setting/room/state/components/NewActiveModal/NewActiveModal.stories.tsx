import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NewActiveModal } from "./NewActiveModal";

const meta = {
  title: 'Features/Setting/Room/State/NewActiveModal',
  component: NewActiveModal,
} satisfies Meta<typeof NewActiveModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roomid: 'example-room-id',
    isOpen: true,
    setIsOpen: () => {},
  },
};