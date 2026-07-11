import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Bell, CircleUserRound, LayoutGrid, Settings, ShieldCheck } from "lucide-react";
import { MenuSidebarLayout, type MenuSelectprops } from "./MenuSidebar";

const settingsMenu: MenuSelectprops[] = [
  { icon: <LayoutGrid className="size-4" />, title: "대시보드", description: "방 통계와 상태를 확인해요", href: "/", isActive: true },
  { icon: <CircleUserRound className="size-4" />, title: "프로필", description: "닉네임과 공개 정보를 관리", href: "/profile/me" },
  { icon: <Bell className="size-4" />, title: "알림", description: "초대와 공지 알림 설정", href: "/setting/group/demo-group" },
  { icon: <ShieldCheck className="size-4" />, title: "권한", description: "멤버 권한과 승인 정책", href: "/setting/group/demo-group" },
  { icon: <Settings className="size-4" />, title: "방 설정", description: "기본 정보와 접근 범위", href: "/setting/group/demo-group" },
];

const meta = {
  title: "Layout/MenuSidebar",
  component: MenuSidebarLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description: "사이드바 상단에 표시되는 섹션 제목",
    },
    menus: {
      control: false,
      description: "렌더링할 메뉴 항목 목록",
    },
    selectedMenu: {
      control: false,
      description: "현재 선택된 메뉴 (isActive 대신 외부에서 활성 상태를 제어할 때 사용)",
    },
    className: {
      control: "text",
      description: "최상위 aside 요소에 병합되는 추가 클래스",
    },
  },
  args: {
    title: "Group Settings",
    menus: settingsMenu,
  },
  decorators: [
    (Story) => (
      <div className="h-140 w-full max-w-sm bg-zinc-100 p-4 dark:bg-zinc-950">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuSidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 제목과 모든 메뉴 항목이 렌더링된다
    await expect(canvas.getByRole("heading", { name: "Group Settings" })).toBeInTheDocument();
    await expect(canvas.getByText("대시보드")).toBeInTheDocument();
    await expect(canvas.getByText("방 설정")).toBeInTheDocument();

    // href가 있는 항목은 링크로 렌더링되고 올바른 경로를 가진다
    const profileLink = canvas.getByRole("link", { name: /프로필/ });
    await expect(profileLink).toHaveAttribute("href", "/profile/me");
  },
};

/** 활성 항목(isActive)이 강조 스타일로 표시되는 모습 */
export const ActiveItem: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const activeLink = canvas.getByRole("link", { name: /대시보드/ });
    await expect(activeLink).toHaveAttribute("href", "/");
  },
};

/** 설명(description) 없이 제목만 있는 간결한 메뉴 */
export const TitlesOnly: Story = {
  args: {
    title: "Navigation",
    menus: settingsMenu.map(({ description: _description, ...menu }) => menu),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText("방 통계와 상태를 확인해요")).not.toBeInTheDocument();
  },
};

/** href가 없는 항목은 링크가 아닌 정적 div로 렌더링된다 */
export const NonLinkItems: Story = {
  args: {
    title: "Read Only",
    menus: settingsMenu.map(({ href: _href, isActive: _isActive, ...menu }) => menu),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("link")).not.toBeInTheDocument();
    await expect(canvas.getByText("대시보드")).toBeInTheDocument();
  },
};

/** title prop이 없을 때의 기본값("Menu") 확인 */
export const DefaultTitle: Story = {
  args: {
    title: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
  },
};

/** 항목이 많아 스크롤이 필요한 경우 */
export const ManyItems: Story = {
  args: {
    title: "All Settings",
    menus: Array.from({ length: 12 }, (_, i) => ({
      icon: <Settings className="size-4" />,
      title: `메뉴 항목 ${i + 1}`,
      description: `${i + 1}번째 설정 화면으로 이동`,
      href: "#",
      isActive: i === 0,
    })),
  },
};

/** 단일 항목만 있는 최소 상태 */
export const SingleItem: Story = {
  args: {
    title: "Profile",
    menus: [settingsMenu[1]],
  },
};
