import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { Active } from "@/generated/prisma/client";
import type { GroupMemberActives } from "../MemberForm/MemberForm";
import { MemberActiveSetting } from "./MemberActivSetting";

const meta = {
    title: "Features/Setting/Group/Member/MemberActiveAssign",
    component: MemberActiveSetting,
    tags: ["autodocs"],
} satisfies Meta<typeof MemberActiveSetting>;

export default meta;
type Story = StoryObj<typeof meta>;

const GROUP_ID = "group-1";
const USER_ID = "user-1";
/** 고정 날짜 — 스냅샷이 실행 시각에 흔들리지 않도록 */
const FIXED_DATE = new Date("2026-01-01T00:00:00.000Z");

function createActive(
    index: number,
    name: string,
    primaryColor: string,
    secondaryColor: string,
): Active {
    return {
        id: `active-${index}`,
        name,
        description: null,
        primaryColor,
        secondaryColor,
        createAt: FIXED_DATE,
        startAt: FIXED_DATE,
        endAt: FIXED_DATE,
        groupId: GROUP_ID,
    };
}

const allActives: Active[] = [
    createActive(1, "입금", "#0d9488", "#ccfbf1"),
    createActive(2, "도착", "#f97316", "#ffedd5"),
    createActive(3, "귀가", "#a855f7", "#f3e8ff"),
    createActive(4, "뒤풀이", "#ec4899", "#fce7f3"),
    createActive(5, "회비 납부", "#3b82f6", "#dbeafe"),
];

/** Active[] → 이 멤버의 MemberActive 조인 행[]으로 감싼다 (컴포넌트가 받는 형태) */
function assign(actives: Active[]): GroupMemberActives[] {
    return actives.map((active, index) => ({
        id: `ma-${index}`,
        groupId: GROUP_ID,
        userId: USER_ID,
        activeId: active.id,
        enable: false,
        startAt: null,
        endAt: null,
        active,
        groupMember: {
            id: `gm-${USER_ID}`,
            groupId: GROUP_ID,
            userId: USER_ID,
            createdAt: FIXED_DATE,
            nickname: null,
            user: { id: USER_ID, name: "테스트 멤버", email: null, emailVerified: null, image: null },
        },
    }));
}

/** 모든 스토리가 공유하는 새 필수 props */
const baseArgs = { groupId: GROUP_ID, userId: USER_ID, onSaved: () => {} };

export const Default: Story = {
    args: {
        ...baseArgs,
        groupAllActives: allActives,
        assignedMemberActives: assign(allActives.slice(0, 3)),
    },
};

/** 배정된 액티브가 없을 때의 빈 상태 */
export const NoAssignedActives: Story = {
    args: {
        ...baseArgs,
        groupAllActives: allActives,
        assignedMemberActives: assign([]),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("아직 생성된 액티브가 없어요")).toBeInTheDocument();
    },
};

/** 첫 번째 배정 액티브가 기본으로 선택된다 */
export const FirstSelectedByDefault: Story = {
    args: {
        ...baseArgs,
        groupAllActives: allActives,
        assignedMemberActives: assign(allActives.slice(0, 3)),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("option", { name: /입금/ })).toHaveAttribute(
            "aria-selected",
            "true",
        );
    },
};

/** 다른 액티브를 클릭하면 선택이 이동한다 (컴포넌트 내부 상태) */
export const SelectOnClick: Story = {
    args: {
        ...baseArgs,
        groupAllActives: allActives,
        assignedMemberActives: assign(allActives.slice(0, 3)),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const target = canvas.getByRole("option", { name: /귀가/ });

        await expect(target).toHaveAttribute("aria-selected", "false");
        await userEvent.click(target);
        await expect(target).toHaveAttribute("aria-selected", "true");
        await expect(canvas.getByRole("option", { name: /입금/ })).toHaveAttribute(
            "aria-selected",
            "false",
        );
    },
};

/**
 * 모달에서 미배정 액티브를 클릭하면 아이콘이 +(추가) → -(제거)로 바뀐다.
 * (부모 state가 갱신되고 모달이 그 prop을 다시 읽는지 검증)
 */
export const AddActiveTogglesIcon: Story = {
    args: {
        ...baseArgs,
        groupAllActives: allActives,
        // 입금·도착만 배정된 상태 → 뒤풀이는 미배정(+)
        assignedMemberActives: assign(allActives.slice(0, 2)),
    },
    play: async ({ canvasElement }) => {
        // 모달 열기: "액티브 추가/관리" 버튼
        await userEvent.click(within(canvasElement).getByRole("button", { name: /액티브 추가/ }));

        // 모달은 portal로 document.body에 렌더된다
        const modal = within(document.body);
        await modal.findByText("이 그룹의 모든 액티브");

        const rowOf = (name: string) =>
            modal.getByText(name).closest("button") as HTMLElement;

        // 미배정 액티브(뒤풀이)는 + 아이콘으로 시작
        const 뒤풀이 = rowOf("뒤풀이");
        await expect(뒤풀이.querySelector(".lucide-circle-plus")).not.toBeNull();
        await expect(뒤풀이.querySelector(".lucide-circle-minus")).toBeNull();

        // 클릭하면 - 아이콘으로 토글
        await userEvent.click(뒤풀이.querySelector<SVGElement>(".lucide-circle-plus")!);
        await expect(뒤풀이.querySelector(".lucide-circle-minus")).not.toBeNull();
        await expect(뒤풀이.querySelector(".lucide-circle-plus")).toBeNull();

        // 다시 클릭하면 +로 되돌아온다
        await userEvent.click(뒤풀이.querySelector<SVGElement>(".lucide-circle-minus")!);
        await expect(뒤풀이.querySelector(".lucide-circle-plus")).not.toBeNull();
    },
};

/** 배정 액티브가 많아 목록이 max-height를 넘겨 스크롤되는 경우 */
export const ManyAssignedActives: Story = {
    args: {
        ...baseArgs,
        groupAllActives: allActives,
        assignedMemberActives: assign(
            Array.from({ length: 12 }, (_, index) =>
                createActive(index + 1, `액티브 ${index + 1}`, "#6366f1", "#e0e7ff"),
            ),
        ),
    },
};

/**
 * 회귀 테스트: 배정 데이터가 마운트 직후 "한 박자 늦게" 도착하는 경우.
 * (부모가 fetch로 assignedMemberActives를 나중에 채우는 실제 상황)
 * userId만 의존하면 이 늦은 데이터가 목록에 반영되지 않는다.
 */
export const AssignmentArrivesLate: Story = {
    args: {
        ...baseArgs,
        groupAllActives: allActives,
        assignedMemberActives: [],
    },
    render: function LateAssignment(args) {
        const [assigned, setAssigned] = useState<GroupMemberActives[]>([]);
        useEffect(() => {
            const id = setTimeout(() => setAssigned(assign(allActives.slice(0, 3))), 0);
            return () => clearTimeout(id);
        }, []);
        return <MemberActiveSetting {...args} assignedMemberActives={assigned} />;
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // 늦게 도착한 배정(입금·도착·귀가)이 목록에 나타나야 한다
        await expect(await canvas.findByRole("option", { name: /입금/ })).toBeInTheDocument();
        await expect(canvas.getByRole("option", { name: /귀가/ })).toBeInTheDocument();
        await expect(canvas.queryByText("아직 생성된 액티브가 없어요")).not.toBeInTheDocument();
    },
};
