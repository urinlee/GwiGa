"use client";

import { useEffect, useRef, useState } from "react";
import { NoticesList } from "../NoticesList/NoticesList";
import { cn } from "@/lib/cn";
import { useDebounce } from "@/hooks/useDebounce";

type GroupNoticesResult = Awaited<ReturnType<typeof import("@/services/groupnotice").getAllGroupNotices>>;
type Group = Awaited<ReturnType<typeof import("@/services/group").getGroup>>;

interface NoticesFieldProps {
    groupId: string;
    page?: number;
    take?: number;
    badgeId?: string;
}

export function NoticesField({ groupId, take }: NoticesFieldProps) {
    const pageSize = take && take <= 30 ? take : 10;

    const [searchValue, setSearchValue] = useState("");
    const debounce = useDebounce<typeof searchValue>(searchValue, 300);

    const [notices, setNotices] = useState<GroupNoticesResult["notices"]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [badges, setBadges] = useState<GroupNoticesResult["badges"]>([]);
    const [group, setGroup] = useState<Group | null>(null);
    const [selectedBadgeId, setSelectedBadgeId] = useState<string | undefined>(undefined);

    const [skip, setSkip] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0); // 에러 재시도용

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // 그룹이 바뀌면 처음부터 다시. (배지 변경은 handleBadgeClick에서 skip을 함께 리셋해
    // 한 렌더로 배치되므로, 여기서 selectedBadgeId를 deps에 넣으면 fetch가 두 번 돈다.)
    useEffect(() => {
        setSkip(0);
    }, [groupId]);

    // 그룹 정보 (한 번)
    useEffect(() => {
        const fetchGroup = async () => {
            const response = await fetch(`/api/v1/group/${groupId}`);
            if (!response.ok) {
                console.error("Failed to fetch group", response.status);
                return;
            }
            setGroup(await response.json());
        };
        fetchGroup();
    }, [groupId]);

    // 페이지 로드: skip===0이면 교체, 아니면 이어붙임
    useEffect(() => {
        let cancelled = false;
        const fetchNotices = async () => {
            setLoading(true);
            setError(false);
            try {
                const params = `?skip=${skip}`+
                        `&take=${pageSize}`+
                        `${selectedBadgeId ? `&badgeId=${selectedBadgeId}` : ""}`+
                        `${debounce ? `&search=${debounce}` : ""}`;
                const response = await fetch(`/api/v1/group/${groupId}/groupnotice/${params}`);
                if (!response.ok) {
                    console.error("Failed to fetch notices", response.status);
                    if (!cancelled) setError(true);
                    return;
                }
                const data: GroupNoticesResult = await response.json();
                if (cancelled) return;
                setBadges(data.badges);
                setTotalCount(data.totalCount);
                setNotices((prev) => {
                    const base = skip === 0 ? [] : prev;
                    const seen = new Set(base.map((n) => n.id));
                    return [...base, ...data.notices.filter((n) => !seen.has(n.id))];
                });
            } catch (e) {
                console.error("Failed to fetch notices", e);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchNotices();
        return () => {
            cancelled = true;
        };
    }, [groupId, selectedBadgeId, skip, pageSize, reloadKey, debounce]); // debounce를 deps에 넣어 검색어가 바뀌면 fetch

    const hasMore = notices.length < totalCount;

    // 바닥 sentinel이 보이면 다음 페이지 (로딩 중엔 관찰 해제해 중복 로드 방지)
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || !hasMore || loading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) setSkip(notices.length);
            },
            { rootMargin: "200px" }, // 바닥 200px 전에 미리 로드
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, loading, notices.length]);


    const handleBadgeClick = (badgeId?: string) => {
        if (badgeId === selectedBadgeId) {
            setSelectedBadgeId(undefined); // 이미 선택된 배지면 무시
            setSkip(0);
            return;
        }
        window.history.replaceState(null, "", `/group/${groupId}/dashboard/notices${badgeId ? `?badgeId=${badgeId}` : ""}`);
        // 배지와 skip을 같은 이벤트에서 함께 리셋 → 한 렌더로 배치되어 fetch가 1번만 실행
        setSelectedBadgeId(badgeId);
        setSkip(0);
    };

    useEffect(() => {
        setSkip(0);
    }, [groupId, debounce]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }


    return (
        <div className="flex flex-col gap-10">
            <div>
                <p className="text-sm text-neutral-600 my-2 pb-2 border-b border-gray-300 dark:text-neutral-400 dark:border-gray-700">{group?.name || "그룹"} · <span className="text-neutral-400">공지사항 {totalCount}개</span></p>
                <h1 className="text-6xl font-bold"> 공지사항</h1>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => handleBadgeClick(undefined)} className={cn("rounded-full px-4 py-2 bg-zinc-50 border border-gray-300 dark:bg-zinc-800 dark:border-gray-700", selectedBadgeId === undefined && "bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-800")}>전체</button>
                    {badges.map((badge) => (
                        <button key={badge.id} onClick={() => handleBadgeClick(badge.id)} className={cn("rounded-full px-4 py-2 bg-zinc-50 border border-gray-300 dark:bg-zinc-800 dark:border-gray-700", selectedBadgeId === badge.id && "bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-800")}>{badge.name}</button>
                    ))}
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="공지사항 검색..." 
                        className="rounded-full px-4 py-2 bg-zinc-50 border border-gray-300 dark:bg-zinc-800 dark:border-gray-700 focus:outline-none"
                        value={searchValue}
                        onChange={onChange}
                         />
                </div>
            </div>

            <NoticesList notices={notices}/>

            {/* 무한 스크롤 상태 */}
            {loading && (
                <div className="py-4 text-center text-sm text-zinc-400">불러오는 중…</div>
            )}
            {error && !loading && (
                <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="py-4 text-center text-sm text-red-500 hover:underline"
                >
                    불러오기 실패 — 다시 시도
                </button>
            )}
            {!hasMore && !loading && notices.length > 0 && (
                <div className="py-4 text-center text-sm text-zinc-400">마지막 공지예요</div>
            )}

            {/* 감지용 sentinel: 더 있을 때만 렌더 */}
            {hasMore && !loading && <div ref={sentinelRef} className="h-1" />}
        </div>
    );
}
