import { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";
import { expect, within } from "storybook/test";
import { NoticesList } from "./NoticesList";

const meta = {
    title: "Features/Notices/NoticesList",
    component: NoticesList,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        /** 카드 클릭 시 router.push를 쓰므로 App Router 목이 필요하다 */
        nextjs: { appDirectory: true },
    },
} satisfies Meta<typeof NoticesList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 서비스(getGroupNotices)의 반환 타입을 그대로 따라간다 — 컴포넌트 props에서 역으로 뽑아 쓴다 */
type GroupNotice = ComponentProps<typeof NoticesList>["notices"][number];

const GROUP_ID = "group-1";
const AUTHOR = "user-author";
const AVATAR = "https://avatars.githubusercontent.com/u/109324792?v=4";
/** 고정 날짜 — 스냅샷이 실행 시각에 따라 흔들리지 않도록 */
const CREATED_AT = new Date("2026-01-01T09:00:00.000Z");

/**
 * 읽음 여부(isRead)는 서버(getGroupNotices)가 요청한 멤버 기준으로 계산해서 내려준다.
 * 컴포넌트는 그 값을 그대로 믿고 New 뱃지만 그린다 — 여기서도 isRead를 직접 준다.
 */
function createNotice(
    index: number,
    title: string,
    {
        isRead = false,
        readCount = 0,
        createdAt = CREATED_AT,
        withBadge = true,
    }: { isRead?: boolean; readCount?: number; createdAt?: Date; withBadge?: boolean } = {},
): GroupNotice {
    return {
        id: `notice-${index}`,
        groupId: GROUP_ID,
        authorId: AUTHOR,
        badgeId: withBadge ? `badge-${index}` : null,
        title,
        content: `${title}의 본문입니다.`,
        createdAt,
        isRead,
        readCount,
        author: {
            id: AUTHOR,
            name: "이우린",
            image: AVATAR,
        },
        badge: withBadge
            ? {
                  id: `badge-${index}`,
                  groupId: GROUP_ID,
                  name: "test",
                  type: "default",
                  backgroundColor: "#a1a1a1",
                  textColor: "#ffffff",
                  description: "test badge",
                  createdAt: CREATED_AT,
              }
            : null,
    };
}

/** 카드마다 "test" 뱃지 span이 하나씩 렌더된다 (컴포넌트에 하드코딩된 값) — 카드 수를 세는 용도 */
const cardCount = (canvas: ReturnType<typeof within>) => canvas.queryAllByText("test").length;

const mockNotices: GroupNotice[] = [
    createNotice(1, "7월 정기 모임 일정 안내", { isRead: true, readCount: 1 }),
    createNotice(2, "회비 납부 안내"),
    createNotice(3, "그룹 규칙이 업데이트되었습니다", { isRead: true, readCount: 2 }),
    createNotice(4, "여름 휴가 기간 활동 중단 공지"),
];

/** 읽은 공지와 안 읽은 공지가 섞인 기본 상태 — 안 읽은 2건에만 New 뱃지가 붙는다 */
export const Default: Story = {
    args: {
        notices: mockNotices,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(cardCount(canvas)).toBe(4);
        await expect(canvas.getAllByText("New")).toHaveLength(2);
    },
};

/** isRead가 false면 New 뱃지 */
export const Unread: Story = {
    args: {
        notices: [createNotice(1, "회비 납부 안내")],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("New")).toBeInTheDocument();
    },
};

/** isRead가 true면 New 뱃지 없음 */
export const Read: Story = {
    args: {
        notices: [createNotice(1, "회비 납부 안내", { isRead: true, readCount: 1 })],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.queryByText("New")).not.toBeInTheDocument();
    },
};

/**
 * 다른 사람만 읽은 공지는 나에겐 여전히 안 읽은 상태다.
 * readCount(그룹 전체 읽은 수)는 New 뱃지에 영향을 주지 않는다 — isRead만 본다.
 */
export const ReadByOthersOnly: Story = {
    args: {
        notices: [createNotice(1, "회비 납부 안내", { isRead: false, readCount: 2 })],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("New")).toBeInTheDocument();
    },
};

/** 뱃지가 지정되지 않은 공지 — 뱃지 자리가 빈 회색 span으로 남는다 (빈 상태 UI 없음) */
export const WithoutBadge: Story = {
    args: {
        notices: [createNotice(1, "출석 체크 방식이 바뀝니다", { withBadge: false })],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(cardCount(canvas)).toBe(0);
        await expect(canvas.getByText("출석 체크 방식이 바뀝니다")).toBeVisible();
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
                isRead: index % 2 === 0,
                readCount: index % 2 === 0 ? 1 : 0,
                createdAt: new Date(CREATED_AT.getTime() - index * 86_400_000),
            }),
        ),
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
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(cardCount(canvas)).toBe(0);
    },
};
