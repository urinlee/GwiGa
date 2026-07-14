import { Prisma } from "@/generated/prisma/client";

type GroupNotice = Awaited<ReturnType<typeof import("@/services/groupnotice").getGroupNotices>>[number];



interface NoticesListProps {
    notices: GroupNotice[];
    userId?: string;
}

export function NoticeCard({ groupNotice, userId }: { groupNotice: GroupNotice, userId?: string }) {
    const isNew = !groupNotice.readMembers.some((readMember) => readMember.userId === userId);
    return (
        <div className="flex cursor-pointer items-center gap-3.5 rounded-[10px] border border-neutral-200 px-4 py-3.5 transition hover:-translate-y-px hover:border-neutral-300 hover:shadow-lg">
            <span className="flex-none rounded-md bg-neutral-400 px-2.5 py-1 text-[11px] font-medium text-white">test</span>
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

export function NoticesList({notices, userId}: NoticesListProps) {
    return (
        <div className="">
            {notices.map((notice) => (
                <NoticeCard key={notice.id} groupNotice={notice} userId={userId} />
            ))}
        </div>
    )
}