import { MenuSelectprops, MenuSidebarLayout } from "@/components/layout/MenuSidebar/MenuSidebar";
import SidebarBackLink from "@/components/layout/MenuSidebar/SidebarBackLink";
import { getGroup } from "@/services/group/group";
import { getUser } from "@/utils/currentUser";
import { ChevronLeft, Flame, Settings, Users } from "lucide-react";
import Link from "next/link";



export default async function GroupSettingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupid: string }>;
}) {
  const { groupid } = await params;
  const encodedGroupId = encodeURIComponent(groupid);

  const menus: MenuSelectprops[] = [
    {
      icon: <Settings className="size-4" />,
      title: "일반",
      description: "기본 정보와 접근 범위",
      href: `/setting/group/${encodedGroupId}/general`,
    },
    {
      icon: <Users className="size-4" />,
      title: "멤버",
      description: "멤버 관리와 권한 설정",
      href: `/setting/group/${encodedGroupId}/member`,
    },
    {
      icon: <Flame className="size-4" />,
      title: "액티브",
      description: "액티브와 관련된 설정",
      href: `/setting/group/${encodedGroupId}/active`,
    }
  ];

  const session = await getUser();
  const data = await getGroup(groupid);
  if (data === null) {
      return (
          <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold">방을 찾을 수 없습니다.</h1>
              <p className="text-gray-500">존재하지 않는 방이거나 삭제된 방입니다.</p>
          </div>
      );
  }
  if (session?.id !== data?.adminId) {
      return (
          <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold">권한이 없습니다.</h1>
              <p className="text-gray-500">이 페이지에 접근할 수 있는 권한이 없습니다.</p>
          </div>
      );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
        <div className="w-72 h-full">
            {/* <SidebarBackLink /> */}
            <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
                <Link
                    href={`/group/${encodedGroupId}/dashboard/`}
                    className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                    <span><ChevronLeft size={15} className="mr-2" /></span> Dashboard로 이동
                </Link>
            </div>
            <MenuSidebarLayout title="Group Settings" menus={menus} />
        </div>
        <main className="flex-1 min-w-0 overflow-y-auto p-6">{children}</main>
    </div>
  );
}


