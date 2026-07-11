import { Meta } from "@storybook/nextjs-vite";
import { ActiveList } from "./ActiveList";


const meta = {
  title: "Features/Setting/Group/Active/ActiveList",
  component: ActiveList,
  tags: ["autodocs"],
} satisfies Meta<typeof ActiveList>;

export default meta;

export const Default = {
  args: {},
};