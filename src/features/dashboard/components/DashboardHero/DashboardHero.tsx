import ContentCard from "@/components/ui/ContentCard/ContentCard";

interface DashboardHeroProps {
    roomName?: string;
    description?: string;
    date?: string;
    tags?: string;
    location?: string;
    participantCount?: number;
}

export default function DashboardHero({
    roomName = "새로운 방",
    description = "설명 없음",
    date = "날짜 미정",
    tags = "태그 없음",
    location = "장소 미정",
    participantCount = 0,
}: DashboardHeroProps) {

    const opTionsTextClass = "text-sm text-zinc-500 dark:text-zinc-400 block";

    return (
        <div>
            <ContentCard>
                <div className="flex flex-col gap-6 mb-4 w-full">
                    <div className="block">
                        <h1 className="text-2xl font-bold block">{roomName}</h1>
                        <p className={opTionsTextClass}>{description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <p className={opTionsTextClass}>시작일: {date}</p>
                        <p className={opTionsTextClass}>태그: {tags}</p>
                        <p className={opTionsTextClass}>모집인원: {participantCount}</p>
                        <p className={opTionsTextClass}>장소: {location}</p>
                    </div>
                </div>
            </ContentCard>
        </div>
    )
}