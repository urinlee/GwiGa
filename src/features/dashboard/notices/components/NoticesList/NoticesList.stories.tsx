import { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { expect, within } from "storybook/test";
import { NoticesList } from "./NoticesList";

const meta = {
    title: "Features/Dashboard/Notices/NoticesList",
    component: NoticesList,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
} satisfies Meta<typeof NoticesList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 서비스(getGroupNotices)의 반환 타입을 그대로 따라간다 — 컴포넌트 props에서 역으로 뽑아 쓴다 */
type GroupNotice = ComponentProps<typeof NoticesList>["notices"][number];

const GROUP_ID = "group-1";
const ME = "user-me";
const AUTHOR = "user-author";
const AVATAR = "https://avatars.githubusercontent.com/u/109324792?v=4";
/** 고정 날짜 — 스냅샷이 실행 시각에 따라 흔들리지 않도록 */
const CREATED_AT = new Date("2026-01-01T09:00:00.000Z");

function createNotice(
    index: number,
    title: string,
    { readBy = [], createdAt = CREATED_AT }: { readBy?: string[]; createdAt?: Date } = {},
): GroupNotice {
    return {
        id: `notice-${index}`,
        groupId: GROUP_ID,
        authorId: AUTHOR,
        title,
        content: `${title}의 본문입니다.`,
        createdAt,
        author: {
            id: AUTHOR,
            name: "이우린",
            image: AVATAR,
        },
        readMembers: readBy.map((userId) => ({ userId })),
    };
}

/** 카드마다 "test" 뱃지 span이 하나씩 렌더된다 (컴포넌트에 하드코딩된 값) — 카드 수를 세는 용도 */
const cardCount = (canvas: ReturnType<typeof within>) => canvas.queryAllByText("test").length;

const mockNotices: GroupNotice[] = [
    createNotice(1, "7월 정기 모임 일정 안내", { readBy: [ME] }),
    createNotice(2, "회비 납부 안내"),
    createNotice(3, "그룹 규칙이 업데이트되었습니다", { readBy: [ME, "user-2"] }),
    createNotice(4, "여름 휴가 기간 활동 중단 공지"),
];

/** 읽은 공지와 안 읽은 공지가 섞인 기본 상태 — 안 읽은 2건에만 New 뱃지가 붙는다 */
export const Default: Story = {
    args: {
        notices: mockNotices,
        userId: ME,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(cardCount(canvas)).toBe(4);
        await expect(canvas.getAllByText("New")).toHaveLength(2);
    },
};

/** readMembers에 내 userId가 없으면 New 뱃지 */
export const Unread: Story = {
    args: {
        notices: [createNotice(1, "회비 납부 안내")],
        userId: ME,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("New")).toBeInTheDocument();
    },
};

/** readMembers에 내 userId가 있으면 뱃지 없음 */
export const Read: Story = {
    args: {
        notices: [createNotice(1, "회비 납부 안내", { readBy: [ME] })],
        userId: ME,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.queryByText("New")).not.toBeInTheDocument();
    },
};

/**
 * 다른 사람만 읽은 공지는 나에겐 여전히 안 읽은 상태다.
 * (readMembers는 그룹 전체의 읽음 기록이므로 userId로 걸러야 한다)
 */
export const ReadByOthersOnly: Story = {
    args: {
        notices: [createNotice(1, "회비 납부 안내", { readBy: ["user-2", "user-3"] })],
        userId: ME,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("New")).toBeInTheDocument();
    },
};

/**
 * userId가 없으면(비로그인·세션 로딩 중) 모든 공지가 New로 보인다.
 * `readMembers.some(m => m.userId === undefined)`가 항상 false이기 때문 — 의도된 동작인지 확인 필요.
 */
export const WithoutUserId: Story = {
    args: {
        notices: mockNotices,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getAllByText("New")).toHaveLength(4);
    },
};

/** 제목이 길면 한 줄로 잘리고(truncate) New 뱃지는 밀리지 않는다 */
export const LongTitle: Story = {
    args: {
        notices: [
            createNotice(
                1,
                "이번 주말 정기 모임 장소가 강남역 2번 출구 스터디카페 3층으로 변경되었으니 착오 없으시길 바랍니다",
            ),
        ],
        userId: ME,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("New")).toBeVisible();
    },
};

/** 여러 건이 쌓였을 때의 목록 밀도 확인 */
export const ManyNotices: Story = {
    args: {
        notices: Array.from({ length: 12 }, (_, index) =>
            createNotice(index + 1, `공지사항 ${index + 1}`, {
                readBy: index % 2 === 0 ? [ME] : [],
                createdAt: new Date(CREATED_AT.getTime() - index * 86_400_000),
            }),
        ),
        userId: ME,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(cardCount(canvas)).toBe(12);
        await expect(canvas.getAllByText("New")).toHaveLength(6);
    },
};

/** 공지가 없을 때 — 현재는 빈 컨테이너만 렌더된다 (빈 상태 UI 없음) */
export const Empty: Story = {
    args: {
        notices: [],
        userId: ME,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(cardCount(canvas)).toBe(0);
    },
};
