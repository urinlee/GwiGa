import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/cn";
import ContentCard from "@/components/ui/ContentCard/ContentCard";

export type HistoryContentStatus = "예정" | "체크안됨" | "체크됨" | "완료";

export interface HistoryContentSectionProps {
  title: string;
  date: string;
  status: HistoryContentStatus;
  redirectUrl?: string;
}

const STATUS_TEXT_CLASS_NAME: Record<HistoryContentStatus, string> = {
  예정: "text-cyan-600 dark:text-cyan-300",
  체크안됨: "text-amber-600 dark:text-amber-300",
  체크됨: "text-sky-600 dark:text-sky-300",
  완료: "text-emerald-600 dark:text-emerald-300",
};

const DETAIL_LINK_CLASS_NAME =
  "flex aspect-square h-full cursor-pointer items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-100";

export function HistoryContentSection({
  title,
  date,
  status,
  redirectUrl,
}: HistoryContentSectionProps) {
  return (
    <ContentCard>
      <div className="flex w-full justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0">
          <h2
            data-testid="history-content-title"
            className="mb-4 truncate text-xl font-bold text-zinc-800 sm:text-2xl lg:text-2xl dark:text-zinc-100"
          >
            {title}
          </h2>
          <p
            data-testid="history-content-date"
            className="px-1 text-[11px] font-medium text-zinc-500 sm:text-[11px] lg:px-2 lg:text-[12px] dark:text-zinc-400"
          >
            {date}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <span
            data-testid="history-content-status"
            className={cn(
              "py-1 text-[20px] font-bold whitespace-nowrap lg:px-2 lg:text-[24px]",
              STATUS_TEXT_CLASS_NAME[status],
            )}
          >
            {status}
          </span>

          {redirectUrl ? (
            <div
              data-testid="history-content-showmore-container"
              className="h-full w-auto py-5 sm:py-2"
            >
              <Link
                aria-label={`${title} 상세 보기`}
                data-testid="history-content-showmore-button"
                href={redirectUrl}
                className={DETAIL_LINK_CLASS_NAME}
              >
                <ChevronRight className="size-6" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </ContentCard>
  );
}
