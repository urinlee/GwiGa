"use client";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

type GroupNotice = Awaited<ReturnType<typeof import("@/services/groupnotice").getAllGroupNotices>>["notices"][number];



interface NoticesListProps {
    notices: GroupNotice[];
}



export function NoticesList({notices}: NoticesListProps) {
    const router = useRouter();

    const handleContentClick = (notice: GroupNotice) => {
        router.push(`/group/${notice.groupId}/notices/${notice.id}`);
    }
    return (
        <div className="flex flex-col gap-5">
            <div className="mb-10 flex items-center justify-center border-dashed border border-neutral-300 bg-zinc-200 py-4 rounded-4xl text-zinc-600 cursor-pointer hover:scale-105 hover:bg-zinc-100 hover:inset-shadow-zinc-300 hover:inset-shadow-2xl transition duration-300" onClick={() => router.push(`/group/${notices[0]?.groupId}/notices/new`)}>
                <CirclePlus className="mr-2 text-zinc-400" size={36} />
                공지사항 추가하기
            </div>
            {notices.map((notice) => (
                <NoticeCard key={notice.id} groupNotice={notice} handleClick={() => handleContentClick(notice)} />
            ))}
        </div>
    )
}

export function NoticeCard({ groupNotice, handleClick }: { groupNotice: GroupNotice, handleClick?: () => void }) {
    const isNew = !groupNotice.isRead
    return (
        <div className="flex cursor-pointer items-center gap-3.5 rounded-[10px] border border-neutral-200 px-4 py-3.5 transition hover:-translate-y-px hover:border-neutral-300 hover:shadow-lg" onClick={handleClick}>
            <span className="flex-none rounded-md px-2.5 py-1 text-[11px] font-medium" style={{backgroundColor: groupNotice.badge?.backgroundColor || "#a1a1a1", color: groupNotice.badge?.textColor || "#ffffff"}}>{groupNotice.badge?.name || "일반"}</span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[14px] font-medium">
                    <span className="truncate">{groupNotice.title}</span>
                    {isNew && <span className="flex-none rounded bg-[#b8482f] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">New</span>}
                </div>
                <div className="mt-1 font-mono text-[11px] text-neutral-400">{groupNotice.createdAt.toLocaleString()}</div>
            </div>
        </div>
    )
}