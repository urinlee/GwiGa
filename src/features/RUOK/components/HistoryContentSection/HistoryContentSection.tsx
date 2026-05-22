import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/cn";
import ContentCard from "@/components/ui/ContentCard/ContentCard";
import { ClassNameValue } from "tailwind-merge";
import { participateContentStatus } from "@/types/ui";



export interface HistoryContentSectionProps {
  title: string;
  date: string;
  status: participateContentStatus;
  redirectUrl?: string;
}

const STATUS_TEXT_CLASS_NAME = {
  예정: "text-cyan-600 dark:text-cyan-300",
  체크안됨: "text-amber-600 dark:text-amber-300",
  체크됨: "text-sky-600 dark:text-sky-300",
  완료: "text-emerald-600 dark:text-emerald-300",
} satisfies Record<participateContentStatus, string> as Record<participateContentStatus, string>;

const DETAIL_LINK_CLASS_NAME:ClassNameValue =
  "flex h-full aspect-square cursor-pointer items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-100";
const HistoryContent_HOVER_CLASS:ClassNameValue =
    "transition-all duration-300 hover:-translate-y-1 hover:scale-101";


export function HistoryContentSection({
  title,
  date,
  status,
  redirectUrl,
}: HistoryContentSectionProps) {
  return (
    <ContentCard style={HistoryContent_HOVER_CLASS}>
      <div className="w-full flex flex-col items-center gap-0 md:flex-row md:justify-between md:gap-4">
        <div className="flex min-w-0 flex-row md:flex-col gap-0">
          <h2
            data-testid="history-content-title"
            className={cn("mb-4 truncate font-bold text-zinc-800 sm:text-2xl lg:text-2xl dark:text-zinc-100", title.length > 8 ? "text-[15px]" : "text-[17px]")}
          >
            {title}
          </h2>
          <p
            data-testid="history-content-date"
            className="hidden px-1 text-[5px] md:block md:text-[12px] font-medium text-zinc-500 dark:text-zinc-400"
          >
            {date}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 md:h-full">
          <span
            data-testid="history-content-status"
            className={cn(
              "md:py-5 text-[15px] md:text-[20px] font-bold whitespace-nowrap lg:px-2 lg:text-[24px]",
              STATUS_TEXT_CLASS_NAME[status],
            )}
          >
            {status}
          </span>

          {redirectUrl ? (
            <div
              data-testid="history-content-showmore-container"
              className="hidden md:flex h-full w-auto py-2 items-center justify-center"
            >
              <Link
                aria-label={`${title} 상세 보기`}
                data-testid="history-content-showmore-button"
                href={redirectUrl}
                className={cn(DETAIL_LINK_CLASS_NAME)}
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
