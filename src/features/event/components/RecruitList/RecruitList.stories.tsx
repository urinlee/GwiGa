import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RecruitList } from "./RecruitList";

const meta = {
    title: "Features/Event/RecruitList",
    component: RecruitList,
    // 이벤트 페이지의 오른쪽 레일 폭(w-64)에서 어떻게 보이는지가 관건이다
    decorators: [
        (Story) => (
            <div className="w-64">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof RecruitList>;

export default meta;
type Story = StoryObj<typeof meta>;

const GROUP_ID = "group-1";
const day = (offset: number) => new Date(Date.now() + offset * 86_400_000);

export const Default: Story = {
    args: {
        groupId: GROUP_ID,
        recruits: [
            {
                id: "recruit-2",
                status: "OPEN",
                title: "2차 모집",
                startAt: day(-1),
                endAt: day(3),
                userCount: 8,
                userMaxCount: 15,
            },
            {
                id: "recruit-1",
                status: "CLOSED",
                title: "1차 모집",
                startAt: day(-10),
                endAt: day(-3),
                userCount: 10,
                userMaxCount: 10,
            },
        ],
    },
};

/** 정원이 코앞이면 숫자와 게이지가 앰버로 바뀌고 남은 자리를 알린다 */
export const NearFull: Story = {
    args: {
        groupId: GROUP_ID,
        recruits: [
            {
                id: "recruit-2",
                status: "OPEN",
                title: "2차 모집",
                startAt: day(-1),
                endAt: day(3),
                userCount: 14,
                userMaxCount: 15,
            },
        ],
    },
};

export const Full: Story = {
    args: {
        groupId: GROUP_ID,
        recruits: [
            {
                id: "recruit-2",
                status: "OPEN",
                title: "2차 모집",
                startAt: day(-1),
                endAt: day(3),
                userCount: 15,
                userMaxCount: 15,
            },
        ],
    },
};

/** 아직 시작 전 — 신청자가 0이라 게이지보다 예정 정보가 중요하다 */
export const Upcoming: Story = {
    args: {
        groupId: GROUP_ID,
        recruits: [
            {
                id: "recruit-3",
                status: "OPEN",
                title: "3차 모집",
                startAt: day(9),
                endAt: day(16),
                userCount: 0,
                userMaxCount: 20,
            },
        ],
    },
};

/** 정원을 안 걸어둔 모집은 게이지 없이 신청 수만 센다 */
export const NoCapacity: Story = {
    args: {
        groupId: GROUP_ID,
        recruits: [
            {
                id: "recruit-4",
                status: "OPEN",
                title: null,
                startAt: day(-2),
                endAt: day(5),
                userCount: 23,
                userMaxCount: null,
            },
        ],
    },
};

export const Empty: Story = {
    args: {
        groupId: GROUP_ID,
        recruits: [],
    },
};
