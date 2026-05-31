import AuthorAvatar from "@/components/ui/AuthorAvatar/AuthorAvatar";
import ToggleTheme from "@/components/ui/ToggleTheme/ToggleTheme";
import { auth } from "@/lib/auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface HeaderProps {
  session: ReturnType<typeof useSession>["data"];
}

export default async function Header({ session }: HeaderProps) {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <h1 className="text-[40px] font-bold text-primary">
          <Link href="/">GwiGa</Link>
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <ToggleTheme />
          </div>
          <div className="flex items-center">
            { session?.user ? <AuthorAvatar style="w-15" /> : <Link className="text-xl font-medium text-muted-foreground hover:text-primary" href="/login">로그인</Link> }
          </div>
        </div>
      </div>
    </header>
  );
}