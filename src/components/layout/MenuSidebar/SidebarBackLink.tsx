"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SidebarBackLink() {
  const searchParams = useSearchParams();
  const returnURL = searchParams.get("returnURL");

  const safeReturnPath =
    returnURL && returnURL.startsWith("/") && !returnURL.startsWith("//")
      ? returnURL
      : null;

  if (!safeReturnPath) {
    return null;
  }

  return (
    <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
      <Link
        href={safeReturnPath}
        className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        Back
      </Link>
    </div>
  );
}
