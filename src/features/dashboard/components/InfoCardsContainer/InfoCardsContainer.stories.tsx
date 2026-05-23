import { expect, within } from 'storybook/test';
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import InfoCardsContainer from "./InfoCardsContainer";
import { participateContentStatus } from "@/types/status";

const meta = {
    title: "Features/Dashboard/InfoCardsContainer",
    tags: ["autodocs"],
    component: InfoCardsContainer,
} satisfies Meta<typeof InfoCardsContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
            participants: [
                {
                    username: "이우린",
                    enableStatus: ["입금", "도착"],
                    allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]
                },
                {
                    username: "김민수",
                    enableStatus: ["입금", "도착", "몰라"],
                    allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]
                },
                {
                    username: "박지민",
                    enableStatus: [],
                    allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]  
                },
                {
                    username: "최수연",
                    enableStatus: ["입금"],
                    allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]
                },
            ]
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // All participants should be rendered
        await expect(canvas.getByText("이우린")).toBeInTheDocument();
        await expect(canvas.getByText("김민수")).toBeInTheDocument();
        await expect(canvas.getByText("박지민")).toBeInTheDocument();
        await expect(canvas.getByText("최수연")).toBeInTheDocument();
    },
};

export const SortingOrder: Story = {
    args: {
        participants: [
            // Pattern "11000" — 2 statuses
            { username: "나중", enableStatus: ["입금", "도착"], allStatus: ["입금", "도착", "귀가", "뒤풀이"] },
            // Pattern "00000" — 0 statuses (appears first)
            { username: "가나다", enableStatus: [], allStatus: ["입금", "도착", "귀가", "뒤풀이"] },
            // Pattern "11110" — 4 statuses (appears last)
            { username: "마지막", enableStatus: ["입금", "도착", "귀가", "뒤풀이"], allStatus: ["입금", "도착", "귀가", "뒤풀이"] },
        ],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const cards = canvas.getAllByText(/가나다|나중|마지막/);
        // Verify all cards are rendered
        await expect(cards.length).toBe(3);
        // "가나다" has pattern "0000" (fewest statuses) so should appear before others
        const allText = canvasElement.textContent ?? "";
        const idxNone = allText.indexOf("가나다");
        const idxTwo = allText.indexOf("나중");
        const idxAll = allText.indexOf("마지막");
        await expect(idxNone).toBeLessThan(idxTwo);
        await expect(idxTwo).toBeLessThan(idxAll);
    },
};

export const EmptyParticipants: Story = {
    args: {
        participants: [],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Container renders but is empty
        await expect(canvas.queryByText(/참가자/)).not.toBeInTheDocument();
    },
};

const ExampleallStatus: participateContentStatus[] = ["입금", "도착", "귀가", "뒤풀이", "몰라"]

const getRandomStatus = () => {
    const randomCount = Math.floor(Math.random() * ExampleallStatus.length) + 1;
    return [...ExampleallStatus].sort(() => Math.random() - 0.5).slice(0, randomCount);
}

export const _29Participants: Story = {
    args: {
        participants: Array.from({ length: 29 }, (_, i) => ({
            username: `참가자${i + 1}`,
            enableStatus: getRandomStatus(),
            allStatus: ExampleallStatus
        }))
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // All 29 participants should be rendered
        for (let i = 1; i <= 29; i++) {
            await expect(canvas.getByText(`참가자${i}`)).toBeInTheDocument();
        }
    },
};