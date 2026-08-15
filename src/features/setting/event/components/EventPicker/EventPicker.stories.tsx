import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventPicker, type EventPickItem } from "./EventPicker";

const meta = {
    title: "Features/Setting/Event/EventPicker",
    component: EventPicker,
    tags: ["autodocs"],
    args: { groupId: "grp_seoul_climb" },
    decorators: [
        (Story) => (
            <div className="mx-auto w-full max-w-3xl px-6 py-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof EventPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const events: EventPickItem[] = [
    {
        id: "evt_autumn_climb",
        name: "가을 정기 등반",
        status: "RECRUITING",
        startAt: new Date("2026-09-05T07:30:00"),
        endAt: new Date("2026-09-05T17:00:00"),
        applicantCount: 14,
        capacity: 40,
        recruitCount: 2,
    },
    {
        id: "evt_newcomer",
        name: "신입 환영회",
        status: "ONGOING",
        startAt: new Date("2026-08-22T19:00:00"),
        endAt: new Date("2026-08-22T22:00:00"),
        applicantCount: 27,
        capacity: 30,
        recruitCount: 1,
    },
    {
        id: "evt_workshop",
        name: "여름 워크숍",
        status: "CLOSED",
        startAt: new Date("2026-07-11T10:00:00"),
        endAt: new Date("2026-07-13T16:00:00"),
        applicantCount: 31,
        capacity: 31,
        recruitCount: 3,
    },
    {
        id: "evt_spring_meet",
        name: "봄 야유회",
        status: "CLOSED",
        startAt: new Date("2026-05-30T09:00:00"),
        endAt: null,
        applicantCount: 18,
        capacity: null,
        recruitCount: 1,
    },
];

export const Default: Story = {
    args: { events },
};

export const OnlyLive: Story = {
    args: { events: events.filter((event) => event.status !== "CLOSED") },
};

/** 강조 행이 모집중(초록)일 때. 초록은 흰 바탕에서 3.49:1이라 바탕에 초록기가 돌면 가장 빡빡해진다. */
export const RecruitingFeatured: Story = {
    args: { events: events.filter((event) => event.status !== "ONGOING") },
};

/** 이벤트를 아직 안 만든 그룹이 처음 들어왔을 때 */
export const Empty: Story = {
    args: { events: [] },
};

/** 일정 미정, 회차 없음, 무제한 정원, 넘치는 이름 — 목록이 무너지지 않아야 한다 */
export const EdgeCases: Story = {
    args: {
        events: [
            {
                id: "evt_undated",
                name: "날짜 미정 번개",
                status: "RECRUITING",
                startAt: null,
                endAt: null,
                applicantCount: 0,
                capacity: null,
                recruitCount: 0,
            },
            {
                id: "evt_unlimited",
                name: "누구나 오는 오픈 스터디",
                status: "ONGOING",
                startAt: new Date("2026-08-19T20:00:00"),
                endAt: null,
                applicantCount: 63,
                capacity: null,
                recruitCount: 2,
            },
            {
                id: "evt_long_name",
                name: "제1회 전국 동시다발 가을맞이 릴레이 등반 및 뒤풀이 한마당",
                status: "RECRUITING",
                startAt: new Date("2026-10-03T06:00:00"),
                endAt: new Date("2026-10-04T20:00:00"),
                applicantCount: 8,
                capacity: 12,
                recruitCount: 4,
            },
        ],
    },
};
