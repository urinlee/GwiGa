import { Meta } from "@storybook/nextjs-vite";
import { SelectActive } from "./SelectActive";


const meta = {
  title: "Features/Setting/Room/State/SelectActive",
  component: SelectActive,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectActive>;

export default meta;

export const Default = {
  args: {},
};