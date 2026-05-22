import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentSectionContainer from "./ContentSectionContainer.";


const meta = {
    title: "Features/RUOK/ContentSectionContainer",
    component: ContentSectionContainer,
} satisfies Meta<typeof ContentSectionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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

    }
};