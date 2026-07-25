"use client";

import { cn } from "@/lib/cn";
import { useEffect, useRef, useState } from "react";

export interface SegmentOption {
    id: number;
    name: any;
    status:string;
}

export interface SegmentControlProps {
    options: SegmentOption[];
    select: SegmentOption;
    onChange?: (option: SegmentOption) => void;
}


function GooeyFilterDef() {
    return (
        <svg className="absolute h-0 w-0" aria-hidden>
            <filter id="segment-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                />
            </filter>
        </svg>
    );
}


export function SegmentControl({ options, select, onChange }: SegmentControlProps) {
    const btnRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });

    // select가 바뀌면 이전 위치와 목표를 감싸는 넓은 박스로 잠깐 늘렸다가(=물방울이 뻗음)
    // 목표 버튼 크기로 수축시킨다. transition이 중간에 목표가 바뀌어도 부드럽게 이어준다.
    useEffect(() => {
        const el = btnRefs.current.get(select.id);
        if (!el) return;
        const target = { left: el.offsetLeft, width: el.offsetWidth };

        setIndicator((prev) => {
            if (prev.width === 0) return target; // 최초 렌더는 스트레치 없이 바로 위치
            const left = Math.min(prev.left, target.left);
            const right = Math.max(prev.left + prev.width, target.left + target.width);
            return { left, width: right - left };
        });

        const t = setTimeout(() => setIndicator(target), 160);
        return () => clearTimeout(t);
    }, [select.id, options]);

    // 리사이즈 시엔 스트레치 없이 목표 위치로 스냅.
    useEffect(() => {
        const snap = () => {
            const el = btnRefs.current.get(select.id);
            if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
        };
        window.addEventListener("resize", snap);
        return () => window.removeEventListener("resize", snap);
    }, [select.id]);

    const onClickButton = (option: SegmentOption) => {
        if (option.id === select.id) return;
        onChange?.(option);
    };

    return (
        <div className="relative inline-flex gap-1 rounded-lg bg-zinc-200 p-1 dark:bg-zinc-700">
            <GooeyFilterDef />

            {/* 물방울 레이어: goo 필터는 이 안(인디케이터)에만 걸려 텍스트에는 영향 없음 */}
            <div className="pointer-events-none absolute inset-0" style={{ filter: "url(#segment-goo)" }}>
                <div
                    className="absolute top-1 bottom-1 rounded-lg bg-zinc-50 dark:bg-zinc-300 transition-all duration-[350ms] ease-out"
                    style={{
                        left: indicator.left,
                        width: indicator.width,
                        opacity: indicator.width ? 1 : 0,
                    }}
                />
            </div>

            {options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    ref={(el) => {
                        if (el) btnRefs.current.set(option.id, el);
                        else btnRefs.current.delete(option.id);
                    }}
                    onClick={() => onClickButton(option)}
                    className={cn(
                        "relative z-10 rounded-lg px-5.5 py-2 text-[15px] font-semibold transition-colors",
                        select.id === option.id ? "text-zinc-900 dark:text-zinc-950" : "text-zinc-500 dark:text-zinc-500",
                    )}
                >
                    {option.name}
                </button>
            ))}
        </div>
    );
}
