import { expect, within } from 'storybook/test';
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentSectionContainer from "./ContentSectionContainer.";


const meta = {
    title: "Features/RUOK/ContentSectionContainer",
    component: ContentSectionContainer,
} satisfies Meta<typeof ContentSectionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // CreateNewSection should always be rendered
        await expect(canvas.getByText("새로운 일정을 추가해보세요!")).toBeInTheDocument();
    },
};

export const WithFiveContent: Story = {
    args: {
        HistoryContents:[
            {
                title: "과 신입생입학환영회",
                date: "2026-06-01",
                status: "체크됨",
            },
            {
                title: "과 개강총회",
                date: "2024-06-01",
                status: "예정",
            },
            {
                title: "단과대 MT",
                date: "2024-06-01",
                status: "예정",
            },
            {
                title: "동아리 MT",
                date: "2024-06-01",
                status: "예정",
            },
            {
                title: "고등학교 동창회",
                date: "2024-06-01",
                status: "예정",
            },
        ]

    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("과 신입생입학환영회")).toBeInTheDocument();
        await expect(canvas.getByText("과 개강총회")).toBeInTheDocument();
        await expect(canvas.getByText("단과대 MT")).toBeInTheDocument();
        await expect(canvas.getByText("동아리 MT")).toBeInTheDocument();
        await expect(canvas.getByText("고등학교 동창회")).toBeInTheDocument();
    },
};