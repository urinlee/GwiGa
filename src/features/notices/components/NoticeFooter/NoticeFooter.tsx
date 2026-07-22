import { ChevronLeft, ChevronRight } from "lucide-react";

export interface noticeOverview {
    id: string;
    title: string;
    contentPreview: string;
    createdAt: Date;
    updatedAt: Date;
    isNew: boolean;
}

interface NoticeFooterProps {
    previousNotice: noticeOverview | null;
    nextNotice: noticeOverview | null;
}

type Direction = "prev" | "next";

// new Date(...)로 감싸 서버→클라이언트 직렬화로 createdAt이 string으로 와도 안전하게 포맷한다.
function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function NoticeNavCard({ notice, direction }: { notice: noticeOverview; direction: Direction }) {
    const isPrev = direction === "prev";

    return (
        <a
            href={`./${notice.id}`}
            className={`group flex min-w-0 flex-1 items-center gap-3.5 rounded-[10px] border border-neutral-200 px-4 py-3.5 transition hover:-translate-y-px hover:border-neutral-300 hover:shadow-lg dark:border-neutral-700 dark:hover:border-neutral-600 ${
                isPrev ? "" : "flex-row-reverse text-right"
            }`}
        >
            {isPrev ? (
                <ChevronLeft className="size-5 shrink-0 text-neutral-300 transition group-hover:-translate-x-0.5 group-hover:text-[#b8482f] dark:text-neutral-600" />
            ) : (
                <ChevronRight className="size-5 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-[#b8482f] dark:text-neutral-600" />
            )}

            <span className="min-w-0 flex-1">
                <span className={`flex items-center gap-1.5 ${isPrev ? "" : "flex-row-reverse"}`}>
                    <span className="font-mono text-[11px] font-medium text-neutral-400 transition-colors group-hover:text-[#b8482f] dark:text-neutral-500">
                        {isPrev ? "이전 글" : "다음 글"}
                    </span>
                    {notice.isNew && (
                        <span className="flex-none rounded bg-[#b8482f] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                            New
                        </span>
                    )}
                </span>

                <span className="mt-1 block truncate text-[14px] font-medium text-neutral-800 transition-colors group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white">
                    {notice.title}
                </span>

                {notice.contentPreview && (
                    <span className="mt-0.5 block truncate text-[12px] text-neutral-400 dark:text-neutral-500">
                        {notice.contentPreview}
                    </span>
                )}

                <span className="mt-1 block font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                    {formatDate(notice.createdAt)}
                </span>
            </span>
        </a>
    );
}

function EmptyNavCard({ direction }: { direction: Direction }) {
    const isPrev = direction === "prev";

    return (
        <div
            className={`flex min-w-0 flex-1 items-center gap-3.5 rounded-[10px] border border-dashed border-neutral-200 px-4 py-3.5 dark:border-neutral-700 ${
                isPrev ? "" : "flex-row-reverse text-right"
            }`}
        >
            {isPrev ? (
                <ChevronLeft className="size-5 shrink-0 text-neutral-200 dark:text-neutral-700" />
            ) : (
                <ChevronRight className="size-5 shrink-0 text-neutral-200 dark:text-neutral-700" />
            )}
            <span className="min-w-0 flex-1 text-neutral-300 dark:text-neutral-600">
                <span className="block font-mono text-[11px] font-medium">
                    {isPrev ? "이전 글" : "다음 글"}
                </span>
                <span className="mt-1 block text-[13px]">
                    {isPrev ? "이전 글이 없습니다" : "다음 글이 없습니다"}
                </span>
            </span>
        </div>
    );
}

export default function NoticeFooter({ previousNotice, nextNotice }: NoticeFooterProps) {
    return (
        <nav
            aria-label="이전·다음 공지 글"
            className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:gap-8"
        >
            {previousNotice ? (
                <NoticeNavCard notice={previousNotice} direction="prev" />
            ) : (
                <EmptyNavCard direction="prev" />
            )}
            {nextNotice ? (
                <NoticeNavCard notice={nextNotice} direction="next" />
            ) : (
                <EmptyNavCard direction="next" />
            )}
        </nav>
    );
}
