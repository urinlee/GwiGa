import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SegmentControl } from "./SegmentControl";

const meta = {
    title: "Components/UI/SegmentControl",
    component: SegmentControl,
    tags: ["autodocs"],
} satisfies Meta<typeof SegmentControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const twoOptions = [
    { id: 1, name: "첫번째" },
    { id: 2, name: "두번째" },
];

// controlled 컴포넌트라 select만 넘기면 클릭해도 안 움직인다.
// onChange로 select를 되돌려줘야 하이라이트가 따라오므로 로컬 state로 감싼다.
export const Default: Story = {
    args: {
        options: twoOptions,
        select: twoOptions[0],
    },
    render: (args) => {
        const [select, setSelect] = useState(args.select);
        return <SegmentControl {...args} select={select} onChange={setSelect} />;
    },
};

const threeOptions = [
    { id: 1, name: "전체" },
    { id: 2, name: "입금" },
    { id: 3, name: "미납" },
];

export const ThreeOptions: Story = {
    args: {
        options: threeOptions,
        select: threeOptions[0],
    },
    render: (args) => {
        const [select, setSelect] = useState(args.select);
        return <SegmentControl {...args} select={select} onChange={setSelect} />;
    },
};
