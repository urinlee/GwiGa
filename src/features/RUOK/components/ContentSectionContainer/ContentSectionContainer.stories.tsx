import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentSectionContainer from "./ContentSectionContainer.";

const meta = {
    title: "Features/RUOK/ContentSectionContainer",
    component: ContentSectionContainer,
    tags: ["autodocs"],
} satisfies Meta<typeof ContentSectionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContents: Story = {
    args: {
        HistoryContents: [
            { id: "1", admin: true,  title: "과 신입생입학환영회", date: "2026-06-01", status: "완료" },
            { id: "2", admin: false, title: "과 개강총회",         date: "2026-03-02", status: "체크됨" },
            { id: "3", admin: false, title: "단과대 MT",           date: "2026-05-10", status: "체크안됨" },
            { id: "4", admin: true,  title: "동아리 MT",           date: "2026-07-15", status: "예정" },
            { id: "5", admin: false, title: "고등학교 동창회",     date: "2026-08-20", status: "예정" },
        ],
    },
};

export const WithCustomStatus: Story = {
    args: {
        HistoryContents: [
            { id: "1", admin: true,  title: "송년회", date: "2026-12-31", status: "커스텀상태" },
            { id: "2", admin: false, title: "신년회", date: "2027-01-01", status: "예정" },
        ],
    },
};
