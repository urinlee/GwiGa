import {
  MenuSidebarLayout,
  MenuTabBar,
  type MenuSelectprops,
} from "@/components/layout/MenuSidebar/MenuSidebar";
import { getEventById } from "@/services/event";
import { ChevronRight, Megaphone, Settings, Users } from "lucide-react";
import Link from "next/link";

export default async function EventSettingDetailLayout({
  children,
  params,
}: LayoutProps<"/setting/event/[groupid]/[eventid]">) {
  const { groupid, eventid } = await params;
  const base = `/setting/event/${encodeURIComponent(groupid)}/${encodeURIComponent(eventid)}`;

  // 인가는 부모 layout과 각 페이지의 verifyAdmin이 본다. 여기서 조회하는 건 화면에 걸 이름뿐이다.
  const event = await getEventById(groupid, eventid);

  const menus: MenuSelectprops[] = [
    {
      icon: <Settings className="size-4" />,
      title: "일반",
      description: "기본 정보와 기간",
      href: `${base}/general`,
    },
    {
      icon: <Users className="size-4" />,
      title: "멤버",
      description: "참가자와 신청 관리",
      href: `${base}/member`,
    },
    {
      icon: <Megaphone className="size-4" />,
      title: "모집",
      description: "회차와 정원 설정",
      href: `${base}/recruit`,
    },
  ];

  return (
    <>
      {/* 본문이 길어져도 메뉴는 제자리다. 상단 바(h-14) 아래에 붙어 자기 안에서만 스크롤한다. */}
      <div className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-72 shrink-0 md:block">
        <MenuSidebarLayout title="이벤트 설정" menus={menus} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 좁은 화면에서 288px 사이드바를 세우면 본문이 남지 않는다. 같은 메뉴를 가로로 눕힌다. */}
        <MenuTabBar menus={menus} className="md:hidden" />

        <main className="w-full px-6 pt-10 pb-16 md:px-10">
          {/* 어느 이벤트를 만지는지는 모든 하위 화면이 공유한다. 페이지마다 다시 적지 않는다. */}
          <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {event?.name ?? "이벤트"}
            </h1>
            <Link
              href={`/group/${encodeURIComponent(groupid)}/event/${encodeURIComponent(eventid)}`}
              className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              이벤트 화면으로
              <ChevronRight className="size-3.5" />
            </Link>
          </header>

          <div className="mt-8">{children}</div>
        </main>
      </div>
    </>
  );
}
