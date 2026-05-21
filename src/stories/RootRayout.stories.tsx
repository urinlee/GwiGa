import RootLayout from "@/app/(main)/layout";
import { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta = {
    title: "Home/RootLayout",
    component: RootLayout,
} satisfies Meta<typeof RootLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const ChildrenComponentExample = <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
    <h2 className="text-2xl font-bold">This is a child component</h2>
</div>;

export const Default: Story = {
    args:{
        children: ChildrenComponentExample
    }
}