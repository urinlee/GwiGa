import { expect, within } from 'storybook/test';
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryContentSection } from "./HistoryContentSection";

const meta = {
    title: "Features/RUOK/HistoryContentSection",
    component: HistoryContentSection,
} satisfies Meta<typeof HistoryContentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "과 개강총회",
        date: "2024-06-01",
        status: "예정"
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByTestId("history-content-title")).toHaveTextContent(args.title!);
        await expect(canvas.getByTestId("history-content-date")).toHaveTextContent(args.date!);
        await expect(canvas.getByTestId("history-content-status")).toHaveTextContent(args.status!);
        // No redirect button when redirectUrl is not provided
        await expect(canvas.queryByTestId("history-content-showmore-button")).not.toBeInTheDocument();
    },
};

export const HaveRedirectUrl: Story = {
    args: {
        title: "과 개강총회",
        date: "2024-06-01",
        status: "예정",
        redirectUrl: "/some-url"
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByTestId("history-content-title")).toHaveTextContent(args.title!);
        await expect(canvas.getByTestId("history-content-status")).toHaveTextContent(args.status!);
        const link = canvas.getByTestId("history-content-showmore-button");
        await expect(link).toHaveAttribute("href", args.redirectUrl);
    },
};

export const AllStatuses: Story = {
    args: {
        title: "완료된 일정",
        date: "2024-01-01",
        status: "완료",
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByTestId("history-content-status")).toHaveTextContent(args.status!);
    },
};

export const LongTitle: Story = {
    args: {
        title: "이름이매우긴일정제목입니다긴제목",
        date: "2025-12-31",
        status: "체크안됨",
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByTestId("history-content-title")).toBeInTheDocument();
        await expect(canvas.getByTestId("history-content-status")).toHaveTextContent(args.status!);
    },
};