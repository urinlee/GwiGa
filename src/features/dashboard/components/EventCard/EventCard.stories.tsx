import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventCard } from "./EventCard";

const meta = {
    title: "Features/Dashboard/Components/EventCard",
    component: EventCard,
    tags: ["autodocs"],
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
    title: "여름 정기 모임",
    description: "한강에서 즐기는 여름 피크닉 모임입니다.",
    primaryColor: "#2563eb",
    secondaryColor: "#294a7f",
    memberCount: 12,
    minMemberCount: 20,
    maxMemberCount: 40,
    dateTitle: "모임 날짜",
    date: new Date("2026-08-15T18:00:00"),
};

export const Recruiting: Story = {
    args: { ...baseArgs, status: "모집중" },
};

export const Ongoing: Story = {
    args: { ...baseArgs, status: "진행중" },
};

export const Closed: Story = {
    args: { ...baseArgs, status: "종료" },
};
