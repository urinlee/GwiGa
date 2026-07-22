"use client";

import { useRef, useState, type ReactNode } from "react";
import {
    Bold, Code, Eye, Heading2, Italic, Link2, List, ListChecks, ListOrdered, Pencil, Quote, Strikethrough,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    /** 에러 상태면 테두리를 강조한다 */
    hasError?: boolean;
    /** 입력 영역에 덧붙일 클래스 (높이 등) */
    className?: string;
    /**
     * 미리보기 렌더러. 넘기면 작성/미리보기 탭이 생긴다.
     * 마크다운 렌더링 방식은 쓰는 쪽이 정하도록 주입받는다.
     */
    renderPreview?: (value: string) => ReactNode;
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-700" />;
}

/**
 * 마크다운 입력기. 서식 툴바 + (선택) 미리보기 탭.
 * controlled 컴포넌트라 react-hook-form에서는 `Controller`로 연결한다.
 */
export function MarkdownEditor({
    value,
    onChange,
    onBlur,
    placeholder,
    hasError,
    className,
    renderPreview,
}: MarkdownEditorProps) {
    const [tab, setTab] = useState<"write" | "preview">("write");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    /** 현재 선택 영역 기준으로 값을 바꾸고 커서를 복원한다 */
    const applyToValue = (
        transform: (value: string, start: number, end: number) => { value: string; start: number; end: number },
    ) => {
        const el = textareaRef.current;
        if (!el) return;
        const next = transform(el.value, el.selectionStart, el.selectionEnd);
        onChange(next.value);
        // 값이 DOM에 반영된 다음에 커서를 되돌린다
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(next.start, next.end);
        });
    };

    /** 선택 영역을 앞뒤로 감싼다. 선택이 없으면 예시 텍스트를 넣고 선택 상태로 둔다 */
    const wrap = (before: string, after: string, example: string) =>
        applyToValue((current, start, end) => {
            const selected = current.slice(start, end) || example;
            return {
                value: current.slice(0, start) + before + selected + after + current.slice(end),
                start: start + before.length,
                end: start + before.length + selected.length,
            };
        });

    /** 커서가 있는 줄 맨 앞에 접두사를 붙인다 (제목·목록·인용 등) */
    const prefixLine = (prefix: string) =>
        applyToValue((current, start, end) => {
            const lineStart = current.lastIndexOf("\n", start - 1) + 1;
            return {
                value: current.slice(0, lineStart) + prefix + current.slice(lineStart),
                start: start + prefix.length,
                end: end + prefix.length,
            };
        });

    return (
        <div className="flex flex-col gap-2">
            {/* 작성 / 미리보기 탭 — 미리보기 렌더러를 넘겼을 때만 */}
            {renderPreview && (
                <div className="flex justify-end">
                    <div className="flex gap-0.5 rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-700">
                        {(["write", "preview"] as const).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setTab(item)}
                                className={cn(
                                    "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-sm transition-colors",
                                    tab === item
                                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                                )}
                            >
                                {item === "write" ? <Pencil size={14} /> : <Eye size={14} />}
                                {item === "write" ? "작성" : "미리보기"}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 서식 툴바 */}
            {tab === "write" && (
                <div className="flex flex-wrap items-center gap-0.5 rounded-lg border border-zinc-300 p-1 dark:border-zinc-700">
                    <ToolbarButton label="굵게" onClick={() => wrap("**", "**", "굵게")}><Bold size={15} /></ToolbarButton>
                    <ToolbarButton label="기울임" onClick={() => wrap("*", "*", "기울임")}><Italic size={15} /></ToolbarButton>
                    <ToolbarButton label="취소선" onClick={() => wrap("~~", "~~", "취소선")}><Strikethrough size={15} /></ToolbarButton>
                    <ToolbarButton label="코드" onClick={() => wrap("`", "`", "코드")}><Code size={15} /></ToolbarButton>
                    <ToolbarDivider />
                    <ToolbarButton label="제목" onClick={() => prefixLine("## ")}><Heading2 size={15} /></ToolbarButton>
                    <ToolbarButton label="인용" onClick={() => prefixLine("> ")}><Quote size={15} /></ToolbarButton>
                    <ToolbarButton label="목록" onClick={() => prefixLine("- ")}><List size={15} /></ToolbarButton>
                    <ToolbarButton label="번호 목록" onClick={() => prefixLine("1. ")}><ListOrdered size={15} /></ToolbarButton>
                    <ToolbarButton label="체크리스트" onClick={() => prefixLine("- [ ] ")}><ListChecks size={15} /></ToolbarButton>
                    <ToolbarDivider />
                    <ToolbarButton label="링크" onClick={() => wrap("[", "](https://)", "링크 텍스트")}><Link2 size={15} /></ToolbarButton>
                </div>
            )}

            {/* 미리보기 탭에서도 언마운트하지 않고 숨김 — 입력 상태·커서 유지 */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                className={cn(
                    "min-h-100 resize-y rounded-xl border bg-white p-4 font-mono text-sm leading-relaxed outline-none transition-colors placeholder:text-zinc-400 dark:bg-zinc-900/40",
                    tab === "preview" && "hidden",
                    hasError
                        ? "border-red-400 focus:border-red-500"
                        : "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500",
                    className,
                )}
            />

            {renderPreview && tab === "preview" && (
                <div className="min-h-100 rounded-xl border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
                    {value.trim() ? (
                        renderPreview(value)
                    ) : (
                        <p className="text-sm text-zinc-400">미리볼 내용이 없어요</p>
                    )}
                </div>
            )}
        </div>
    );
}
