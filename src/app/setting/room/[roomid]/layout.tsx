import { MenuSelectprops, MenuSidebarLayout } from "@/components/layout/MenuSidebar/MenuSidebar";
import SidebarBackLink from "@/components/layout/MenuSidebar/SidebarBackLink";
import { ChevronLeft, Settings, Users } from "lucide-react";
import Link from "next/link";



export default async function RoomSettingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomid: string }>;
}) {
  const { roomid } = await params;
  const encodedRoomId = encodeURIComponent(roomid);

  const menus: MenuSelectprops[] = [
    {
      icon: <Settings className="size-4" />,
      title: "일반",
      description: "기본 정보와 접근 범위",
      href: `/setting/room/${encodedRoomId}/general`,
    },
    {
      icon: <Users className="size-4" />,
      title: "멤버",
      description: "멤버 관리와 권한 설정",
      href: `/setting/room/${encodedRoomId}/member`,
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
        <div className="w-72 h-full">
            {/* <SidebarBackLink /> */}
            <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
                <Link
                    href={`/room/${encodedRoomId}/dashboard/`}
                    className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                    <span><ChevronLeft size={15} className="mr-2" /></span> Dashboard로 이동
                </Link>
            </div>
            <MenuSidebarLayout title="Room Settings" menus={menus} />
        </div>
        <main className="flex-1 p-6">{children}</main>
    </div>
  );
}


