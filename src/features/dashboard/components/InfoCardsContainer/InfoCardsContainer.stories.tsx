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
    }
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
    }
};