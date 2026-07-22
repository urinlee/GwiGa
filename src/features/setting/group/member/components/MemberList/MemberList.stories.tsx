import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import type { GroupMemberWithUser } from "../MemberForm/MemberForm";
import { MemberList } from "./MemberList";

const meta = {
    title: "Features/Setting/Group/Member/MemberList",
    component: MemberList,
    tags: ["autodocs"],
    args: {
        onSelectMember: fn(),
    },
} satisfies Meta<typeof MemberList>;

export default meta;
type Story = StoryObj<typeof meta>;

const AVATAR = "https://avatars.githubusercontent.com/u/109324792?v=4";
const GROUP_ID = "group-1";
/** 고정 날짜 — 스냅샷이 실행 시각에 따라 흔들리지 않도록 */
const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");

function createMember(
    index: number,
    name: string,
    { nickname = null, image = null }: { nickname?: string | null; image?: string | null } = {},
): GroupMemberWithUser {
    return {
        id: `member-${index}`,
        groupId: GROUP_ID,
        userId: `user-${index}`,
        createdAt: CREATED_AT,
        nickname,
        user: {
            id: `user-${index}`,
            name,
            email: `user${index}@example.com`,
            emailVerified: null,
            image,
        },
    };
}

const mockMembers: GroupMemberWithUser[] = [
    createMember(1, "이우린", { nickname: "방장", image: AVATAR }),
    createMember(2, "김민수", { nickname: "총무", image: AVATAR }),
    createMember(3, "박지민"),
    createMember(4, "최유진", { image: AVATAR }),
    createMember(5, "정하늘", { nickname: "하늘이" }),
    createMember(6, "Alice"),
];

const SURNAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
const GIVEN_NAMES = ["민준", "서연", "도윤", "하은", "시우", "지우", "주원", "서준", "예은", "지호"];

/** 성 10개 × 이름 10개 = 100명 (이름 중복 없음, 별명 없음) */
const manyMembers: GroupMemberWithUser[] = Array.from({ length: 100 }, (_, index) =>
    createMember(
        index + 1,
        `${SURNAMES[index % SURNAMES.length]}${GIVEN_NAMES[Math.floor(index / SURNAMES.length)]}`,
        { image: index % 3 === 0 ? AVATAR : null },
    ),
);

type Canvas = ReturnType<typeof within>;

/**
 * 카드는 이름을 두 번 렌더한다 (굵은 글씨 `nickname || user.name` + 우측 `user.name`).
 * 별명이 없으면 같은 텍스트가 2개가 되므로 getByText 대신 getAllByText로 센다.
 */
const expectVisible = (canvas: Canvas, name: string) =>
    expect(canvas.getAllByText(name).length).toBeGreaterThan(0);

const expectHidden = (canvas: Canvas, name: string) =>
    expect(canvas.queryAllByText(name)).toHaveLength(0);

/** 카드 엘리먼트 (이름 span → 부모 flex → 카드). 별명이 있는 멤버에만 사용할 것 */
const cardOf = (canvas: Canvas, uniqueText: string) =>
    canvas.getByText(uniqueText).closest("div.rounded-lg") as HTMLElement;

const searchFor = async (canvasElement: HTMLElement, query: string) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByPlaceholderText("멤버 검색"), query);
    return canvas;
};

export const Default: Story = {
    args: {
        members: mockMembers,
    },
};

/** 별명이 있으면 굵은 글씨로 별명, 우측에 실제 이름이 뜬다 */
export const WithNickname: Story = {
    args: {
        members: [mockMembers[0]],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("방장")).toBeInTheDocument();
        await expect(canvas.getByText("이우린")).toBeInTheDocument();
    },
};

/** 별명이 없으면 실제 이름으로 폴백 — 같은 이름이 두 번 렌더된다 */
export const WithoutNickname: Story = {
    args: {
        members: [mockMembers[2]],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getAllByText("박지민")).toHaveLength(2);
    },
};

/** 선택된 멤버는 카드 배경이 강조된다 */
export const SelectedMember: Story = {
    args: {
        members: mockMembers,
        selectedMember: mockMembers[1],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const selected = getComputedStyle(cardOf(canvas, "총무")).backgroundColor;
        const unselected = getComputedStyle(cardOf(canvas, "방장")).backgroundColor;
        await expect(selected).not.toBe(unselected);
    },
};

/** 카드를 클릭하면 해당 멤버로 onSelectMember가 호출된다 */
export const SelectOnClick: Story = {
    args: {
        members: mockMembers,
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByText("총무"));
        await expect(args.onSelectMember).toHaveBeenCalledWith(
            expect.objectContaining({ id: "member-2" }),
        );
    },
};

/** MemberList는 controlled 컴포넌트라, 부모가 상태를 들고 있어야 선택이 실제로 바뀐다 */
export const Interactive: Story = {
    args: {
        members: mockMembers,
    },
    render: function InteractiveMemberList(args) {
        const [selected, setSelected] = useState<GroupMemberWithUser | null>(null);
        return (
            <MemberList
                {...args}
                selectedMember={selected}
                onSelectMember={(member) => {
                    args.onSelectMember?.(member);
                    setSelected(member);
                }}
            />
        );
    },
};

/** 멤버가 한 명도 없을 때의 빈 상태 */
export const Empty: Story = {
    args: {
        members: [],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("검색 결과가 없어요")).toBeInTheDocument();
    },
};

/** 100명 규모의 대형 그룹 — 목록이 max-height를 넘겨 스크롤된다 */
export const LargeGroup: Story = {
    args: {
        members: manyMembers,
    },
    play: async ({ canvasElement }) => {
        const canvas = await searchFor(canvasElement, "장예은");
        await expectVisible(canvas, "장예은");
        await expectHidden(canvas, "김민준");
    },
};

/** 초성만 입력해도 매칭된다: "ㅇㅇㄹ" → "이우린" */
export const SearchByChoseong: Story = {
    args: {
        members: mockMembers,
    },
    play: async ({ canvasElement }) => {
        const canvas = await searchFor(canvasElement, "ㅇㅇㄹ");
        await expectVisible(canvas, "이우린");
        await expectHidden(canvas, "김민수");
    },
};

/** 오타를 허용한다: "이우진" → "이우린" */
export const SearchWithTypo: Story = {
    args: {
        members: mockMembers,
    },
    play: async ({ canvasElement }) => {
        const canvas = await searchFor(canvasElement, "이우진");
        await expectVisible(canvas, "이우린");
        await expectHidden(canvas, "김민수");
    },
};

/** 영문 이름도 그대로 검색된다 */
export const SearchByEnglishName: Story = {
    args: {
        members: mockMembers,
    },
    play: async ({ canvasElement }) => {
        const canvas = await searchFor(canvasElement, "Ali");
        await expectVisible(canvas, "Alice");
        await expectHidden(canvas, "박지민");
    },
};

/**
 * 현재 검색은 `user.name`만 인덱싱한다 (useHangulFuzzySearch의 selector).
 * 그래서 화면에 보이는 별명("총무")으로는 검색되지 않는다 — 의도된 동작인지 확인 필요.
 */
export const SearchByNicknameDoesNotMatch: Story = {
    args: {
        members: mockMembers,
    },
    play: async ({ canvasElement }) => {
        const canvas = await searchFor(canvasElement, "총무");
        await expect(canvas.getByText("검색 결과가 없어요")).toBeInTheDocument();
    },
};

/** 매칭되는 멤버가 없을 때 */
export const NoSearchResult: Story = {
    args: {
        members: mockMembers,
    },
    play: async ({ canvasElement }) => {
        const canvas = await searchFor(canvasElement, "존재하지않는이름");
        await expect(canvas.getByText("검색 결과가 없어요")).toBeInTheDocument();
    },
};
