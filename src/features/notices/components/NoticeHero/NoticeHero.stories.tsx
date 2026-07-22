import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NoticeHero } from "./NoticeHero";

const meta = {
    title: "Features/Notices/NoticeHero",
    component: NoticeHero,
    tags: ["autodocs"],
} satisfies Meta<typeof NoticeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        groupId: "group-1",
        noticeId: "notice-1",
        title: "공지사항 제목",
        date: "2026-01-01T09:00:00.000Z",
        authorName: "이우린",
        badge: {
            id: "badge-1",
            name: "공지사항 뱃지",
            backgroundColor: "#FF0000",
            textColor: "#FFFFFF",
        },
    },
};