import { MenuSelectprops, MenuSidebarLayout } from "@/components/layout/MenuSidebar/MenuSidebar";
import SidebarBackLink from "@/components/layout/MenuSidebar/SidebarBackLink";
import { SettingLayout } from "@/components/layout/Setting/SettingLayout";
import { getGroup } from "@/services/group";
import { getCurrentUser } from "@/utils/currentUser";
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

  const menusOptions = [
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
  ]

  const session = await getCurrentUser();
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
    <SettingLayout menuLabel={"그룹 설정하기"} menus={menusOptions} returnButton={{ href: `/group/${encodedGroupId}/dashboard`, label: "그룹 대시보드로 돌아가기" }}>
      {children}
    </SettingLayout>
  );
}


