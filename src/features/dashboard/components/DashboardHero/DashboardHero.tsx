import ContentCard from "@/components/ui/ContentCard/ContentCard";
import { Calendar, MapPin, Tag, Users } from "lucide-react";

interface DashboardHeroProps {
    groupName?: string;
    description?: string;
    date?: string;
    tags?: string;
    location?: string;
    participantCount?: number;
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-400 dark:ring-zinc-700">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">{label}</p>
                <p className="truncate text-sm font-semibold text-zinc-700 dark:text-zinc-200">{value}</p>
            </div>
        </div>
    );
}

export default function DashboardHero({
    groupName = "새로운 방",
    description = "설명 없음",
    date = "날짜 미정",
    tags = "태그 없음",
    location = "장소 미정",
    participantCount = 0,
}: DashboardHeroProps) {
    return (
        <ContentCard>
            <div className="flex w-full flex-col gap-6">
                {/* 헤더: 방 이름 · 설명 · 참여인원 */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-bold text-zinc-900 dark:text-white">{groupName}</h1>
                        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 py-1.5 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
                        <Users size={15} strokeWidth={2.5} />
                        {participantCount}
                    </div>
                </div>

                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-700" />

                {/* 메타 정보 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <MetaItem icon={<Calendar size={16} />} label="시작일" value={date} />
                    <MetaItem icon={<Tag size={16} />} label="태그" value={tags} />
                    <MetaItem icon={<MapPin size={16} />} label="장소" value={location} />
                </div>
            </div>
        </ContentCard>
    );
}
