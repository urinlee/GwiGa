import { cn } from "@/lib/cn";

export interface EventAboutProps {
    /** 마크다운이 아니라 textarea 원문이라 줄바꿈만 살린다. */
    description?: string | null;
    /** 섹션 제목. 기본 "이벤트 소개" */
    title?: string;
    className?: string;
}

/** 액티브 목록 옆 레일에 놓는 이벤트 소개. 글 길이와 무관하게 높이를 고정하고 넘치면 스크롤한다. */
export function EventAbout({ description, title = "이벤트 소개", className }: EventAboutProps) {
    if (!description) return null;

    return (
        <aside className={cn("min-w-0", className)}>
            <h2 className="text-[11px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">{title}</h2>

            {/* 스크롤 영역은 키보드로도 훑을 수 있게 포커스를 받는다 */}
            <div
                role="region"
                aria-label={title}
                tabIndex={0}
                className="mt-2 h-56 overflow-y-auto overscroll-contain pr-2 text-[14px] leading-relaxed whitespace-pre-line text-zinc-600 dark:text-zinc-300"
            >
                {description}
            </div>
        </aside>
    );
}
