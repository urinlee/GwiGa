"use client";
import { canBeChoseong, disassemble, getChoseong } from "es-hangul";
import Fuse, { type Expression } from "fuse.js";
import { useMemo } from "react";

interface SearchEntry<T> {
    original: T;
    /** 원문 (예: "이우린") */
    name: string;
    /** 초성 (예: "ㅇㅇㄹ") — 한글이 아닌 문자는 제거된다 */
    choseong: string;
    /** 자모 분해 (예: "ㅇㅣㅇㅜㄹㅣㄴ") — 한글이 아닌 문자는 그대로 통과 */
    jamo: string;
}

/** 쿼리가 초성으로만 이루어졌는지 (예: "ㅇㅇㄹ") */
function isChoseongOnly(compactQuery: string): boolean {
    return compactQuery.length > 0 && [...compactQuery].every((char) => canBeChoseong(char));
}

/**
 * 한글 퍼지 검색.
 * - 초성 검색: "ㅇㅇㄹ" → "이우린"
 * - 부분 입력: "이ㅇ" → "이우린" (자모 분해 후 매칭)
 * - 오타 허용: "이우진" → "이우린" (Fuse)
 * - 영문도 그대로 동작
 *
 * selector는 렌더마다 새로 만들지 말고 컴포넌트 바깥에 정의할 것 (검색 인덱스 재생성 방지).
 */
export function useHangulFuzzySearch<T>(
    items: T[],
    query: string,
    selector: (item: T) => string,
): T[] {
    const entries = useMemo<SearchEntry<T>[]>(
        () =>
            items.map((original) => {
                const name = selector(original);
                return { original, name, choseong: getChoseong(name), jamo: disassemble(name) };
            }),
        [items, selector],
    );

    const fuse = useMemo(
        () =>
            new Fuse(entries, {
                keys: ["name", "choseong", "jamo"],
                threshold: 0.3,
                // 문자열 앞부분에만 가중치를 두지 않도록 (이름 중간 매칭 허용)
                ignoreLocation: true,
                minMatchCharLength: 1,
            }),
        [entries],
    );

    return useMemo(() => {
        const trimmed = query.trim();
        const compact = trimmed.replace(/\s+/g, "");
        if (!compact) return items;

        // 초성 쿼리는 초성 키에만 매칭한다.
        // (자모 키까지 열어두면 "ㄱㅎ"가 이름 곳곳의 ㄱ·ㅎ에 걸려 오탐이 난다)
        const expression: Expression = isChoseongOnly(compact)
            ? { choseong: compact }
            : { $or: [{ name: trimmed }, { jamo: disassemble(trimmed) }] };

        return fuse.search(expression).map((result) => result.item.original);
    }, [fuse, items, query]);
}
