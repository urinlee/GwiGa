import { Meta, StoryObj } from "@storybook/nextjs-vite";
import NoticeFooter from "./NoticeFooter";

const meta = {
    title: "Features/Notices/NoticeFooter",
    component: NoticeFooter,
    tags: ["autodocs"],
} satisfies Meta<typeof NoticeFooter>;

export default meta;

type Story = StoryObj<typeof NoticeFooter>;

const sampleNotice = {
    id: "notice-1",
    title: "이번 주 정기 모임 안내드립니다",
    contentPreview: "안녕하세요, 이번 주 정기 모임은...",
    badgeId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isNew: false,
};

export const Default: Story = {
    args: {
        previousNotice: { ...sampleNotice, id: "prev-1", title: "지난 회비 정산 결과 공유" },
        nextNotice: { ...sampleNotice, id: "next-1", title: "다음 달 워크숍 장소 투표" },
    },
};

export const OnlyPrevious: Story = {
    args: {
        previousNotice: { ...sampleNotice, id: "prev-1", title: "지난 회비 정산 결과 공유" },
        nextNotice: null,
    },
};

export const OnlyNext: Story = {
    args: {
        previousNotice: null,
        nextNotice: { ...sampleNotice, id: "next-1", title: "다음 달 워크숍 장소 투표" },
    },
};
