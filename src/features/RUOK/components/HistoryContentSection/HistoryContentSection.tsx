import { ChevronRight } from "lucide-react";
import Link from "next/link";

type HistoryContentStatus = "예정" | "체크안됨" | "체크됨" | "완료"

interface HistoryContentSectionProps {
    title: string;
    date: string;
    status: HistoryContentStatus;
    redirectUrl?: string;
}

const StatusColorMap: Record<HistoryContentStatus, string> = {
    "예정": "text-teal-600 dark:text-emerald-100",
    "체크안됨": "text-yellow-500 dark:text-yellow-600",
    "체크됨": "text-blue-500 dark:text-blue-500",
    "완료": "text-green-500 dark:text-green-600"
}

export function HistoryContentSection({ title, date, status, redirectUrl }: HistoryContentSectionProps) {

    return(
        <article data-testid="history-content-section" className="flex px-6 py-4 bg-zinc-700 rounded-[20px] sm:px-8 lg:px-10 dark:bg-mist-700">
            <div className="flex justify-between w-full">
                <div className="flex flex-col gap-0">
                    <h2 data-testid="history-content-title" className="text-1xl sm:text-2xl lg:text-2xl text-zinc-200 dark:text-zinc-400 font-bold mb-4">{title}</h2>
                    <p data-testid="history-content-date" className="text-zinc-400 text-[11px] sm:text-[11px] lg:text-[12px] px-1 lg:px-2">{date}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div data-testid="history-content-status" className={`${StatusColorMap[status]} text-[20px] lg:text-[24px] font-bold lg:px-2 py-1 whitespace-nowrap`}>{status}</div>
                    {redirectUrl && (
                        <div data-testid="history-content-showmore-container" className="py-5 sm:py-2 h-full w-auto">
                            <Link href={redirectUrl}>
                                <div data-testid="history-content-showmore-button" className="aspect-square h-full rounded-full border border-zinc-500 flex items-center justify-center cursor-pointer text-zinc-400 dark:border-zinc-500 dark:text-zinc-500">
                                    <ChevronRight />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}