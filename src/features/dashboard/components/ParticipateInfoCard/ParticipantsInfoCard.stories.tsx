import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ParticipantInfoCard from "./ParticipantsInfoCard";


const meta = {
    title: "Features/Dashboard/ParticipateInfoCard",
    component: ParticipantInfoCard,
    
} satisfies Meta<typeof ParticipantInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args:{
        username: "이우린",
        enableStatus: [],
        allStatus: []

    }
};

export const WithStatus: Story = {
    args:{
        username: "이우린",
        enableStatus: ["입금", "도착"],
        allStatus: ["입금", "도착", "귀가", "뒤풀이"]

    }
};

export const WithCustomStatus: Story = {
    args:{
        username: "이우린",
        enableStatus: ["입금", "도착"],
        allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]

    }
};
export const WithCustomStatusEnable: Story = {
    args:{
        username: "이우린",
        enableStatus: ["입금", "도착", "몰라"],
        allStatus: ["입금", "도착", "귀가", "뒤풀이", "몰라"]

    }
};