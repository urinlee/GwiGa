import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { GetInputArea } from "./GetInput";

const meta = {
    title: "Components/UI/GetInput",
    component: GetInputArea,
} satisfies Meta<typeof GetInputArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
    args: {
        type: "text",
        title: "이름 입력",
        description: "이름을 입력하세요",
        required: true,
        maxLength: 200,
    },
};

export const TextInputWithError: Story = {
    args: {
        type: "text",
        title: "이름 입력",
        description: "이름을 입력하세요",
        required: true,
        error: "필수 항목입니다",
    },
};

export const TextInputWithPlaceholder: Story = {
    args: {
        type: "text",
        title: "그룹 내 닉네임",
        description: "멤버의 그룹 내 닉네임을 입력하세요",
        placeholder: "예) 방장",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByPlaceholderText("예) 방장")).toBeInTheDocument();
    },
};

export const TextAreaDefault: Story = {
    args: {
        type: "textarea",
        title: "이름 입력",
        description: "이름을 입력하세요",
    },
};

export const TextAreaWithPlaceholder: Story = {
    args: {
        type: "textarea",
        title: "그룹 소개",
        description: "그룹 소개를 입력하세요",
        isLong: true,
        placeholder: "어떤 모임인지 간단히 적어주세요",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByPlaceholderText("어떤 모임인지 간단히 적어주세요")).toBeInTheDocument();
    },
};

export const TextAreaWithLongInput: Story = {
    args: {
        type: "textarea",
        title: "이름 입력",
        description: "이름을 입력하세요",
        isLong: true,
    },
};

export const TextAreaWithShortInput: Story = {
    args: {
        type: "textarea",
        title: "이름 입력",
        description: "이름을 입력하세요",
        isLong: false,
    },
};

export const TextAreaWithLongInputAndLongDescription: Story = {
    args: {
        type: "textarea",
        title: "이름 입력",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        isLong: true,
    },
};

export const SelectInput: Story = {
    args: {
        type: "select",
        title: "옵션 선택",
        description: "옵션을 선택하세요",
        options: ["옵션 1", "옵션 2", "옵션 3"],
    },
};

export const ToggleInput: Story = {
    args: {
        type: "toggle",
        title: "토글 스위치",
        description: "토글 스위치를 켜거나 끄세요",
    },
};

export const CheckboxInput: Story = {
    args: {
        type: "checkbox",
        title: "체크박스",
        description: "체크박스를 선택하세요",
    },
};

export const RadioInput: Story = {
    args: {
        type: "radio",
        title: "라디오 버튼",
        description: "라디오 버튼을 선택하세요",
        options: ["옵션 1", "옵션 2"],
    },
};
