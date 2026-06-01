import { LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import AuthorAvatar from "../AuthorAvatar/AuthorAvatar";
import { signOut } from "next-auth/react";


interface HeaderProfileMenuProps {
  imageUrl?: string | null;
  name?: string | null;
  handle?: string | null;
}

const menuItems = [
  {
    href: "/profile",
    icon: UserRound,
    label: "프로필",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "설정",
  },
];

export default function HeaderProfileMenu({
  imageUrl,
  name = "홍길동",
  handle = "@honggildong",
}: HeaderProfileMenuProps) {
  const displayName = name || "익명 사용자";
  const displayHandle = handle || "@guest";

  return (
    <div className="w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-xl shadow-zinc-950/10 ring-1 ring-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-black/30 dark:ring-white/10">
      <div className="bg-linear-to-br from-zinc-50 via-white to-zinc-100 px-5 pb-5 pt-6 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white p-1 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <AuthorAvatar
              description={`${displayName} 프로필 이미지`}
              imageUrl={imageUrl || undefined}
              style="size-16"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-text-primary">
              {displayName}
            </p>
            <p className="truncate text-sm text-text-secondary">
              {displayHandle}
            </p>
          </div>
        </div>

        {/* <div className="mt-5 rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
          <p className="font-medium text-zinc-900 dark:text-zinc-50">
            오늘도 귀가 체크 준비 완료
          </p>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            내 활동과 계정 설정을 빠르게 확인하세요.
          </p>
        </div> */}
      </div>

      <nav className="p-2" aria-label="프로필 메뉴">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-white"
            href={href}
            key={href}
          >
            <Icon className="size-4 text-zinc-500 dark:text-zinc-400" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          onClick={() => {
            signOut({ redirectTo: "/" });  
          }}
        >
          <LogOut className="size-4" />
          <span>로그아웃</span>
        </div>
      </div>
    </div>
  );
}
