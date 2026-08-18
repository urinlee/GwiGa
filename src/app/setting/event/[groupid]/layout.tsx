import { getGroup } from "@/services/group";
import { getCurrentUser } from "@/utils/currentUser";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/** 설정을 벗어나는 문과 "어느 그룹인지"를 목록·상세가 나눠 쓴다. 페이지는 내용만 그린다. */
function Guard({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action: { href: string; label: string };
}) {
    return (
        <div className="flex flex-1 items-center justify-center px-6 py-16">
            <div className="text-center">
                <h1 className="text-[20px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
                <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400">{description}</p>
                <Link
                    href={action.href}
                    className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-zinc-900 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
                >
                    {action.label}
                </Link>
            </div>
        </div>
    );
}

export default async function EventSettingLayout({ children, params }: LayoutProps<"/setting/event/[groupid]">) {
    const { groupid } = await params;
    const encodedGroupId = encodeURIComponent(groupid);

    // 두 조회 모두 cache가 걸려 있어 페이지가 다시 불러도 같은 요청 안에서는 한 번이다.
    const [user, group] = await Promise.all([getCurrentUser(), getGroup(groupid)]);

    if (group === null) {
        return (
            <div className="flex min-h-[100dvh] flex-col">
                <Guard
                    title="그룹을 찾을 수 없습니다"
                    description="없어졌거나 주소가 잘못된 그룹이에요."
                    action={{ href: "/", label: "홈으로" }}
                />
            </div>
        );
    }

    // 실제 인가는 페이지의 verifyAdmin이 한다. 여기 검사는 관리자 아닌 사람에게 그룹 이름을 안 내주려는 것.
    if (user?.id !== group.adminId) {
        return (
            <div className="flex min-h-[100dvh] flex-col">
                <Guard
                    title="설정할 권한이 없습니다"
                    description="이벤트 설정은 그룹 관리자만 열 수 있어요."
                    action={{ href: `/group/${encodedGroupId}/dashboard`, label: "그룹 대시보드로" }}
                />
            </div>
        );
    }

    return (
        <div className="flex min-h-[100dvh] flex-col">
            {/* 목록과 상세가 같은 문을 쓴다. 페이지마다 뒤로가기를 따로 그리면 화면마다 위치가 흔들린다. */}
            <div className="sticky top-0 z-10 border-b border-zinc-200/80 bg-background dark:border-zinc-800/80">
                {/* 아래가 사이드바까지 걸친 폭이라 문도 폭을 맞춘다. 화살표가 사이드바 아이콘 줄과 같은 선에 선다. */}
                <div className="flex h-14 w-full items-center px-6">
                    <Link
                        href={`/group/${encodedGroupId}/dashboard`}
                        className="-ml-2 inline-flex min-w-0 items-center gap-1 rounded-md px-2 py-1.5 text-[13px] font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100"
                    >
                        <ChevronLeft className="size-4 shrink-0" />
                        <span className="truncate">{group.name}</span>
                    </Link>
                </div>
            </div>
            {/* 사이드바는 이벤트를 고른 뒤에야 뜻이 있다. 본문 틀은 목록과 상세가 각자 그린다. */}
            <div className="flex min-h-0 flex-1">{children}</div>
        </div>
    );
}
