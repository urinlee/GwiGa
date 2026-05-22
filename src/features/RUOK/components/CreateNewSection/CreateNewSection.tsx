import ContentCard from "@/components/ui/ContentCard/ContentCard";
import Link from "next/link";

export default function CreateNewSection() {
    return (
        <Link href="RUOK/create">
            <ContentCard style="border-dashed border-2 border-zinc-400 dark:border-zinc-600">
                <div className="flex w-full flex-col items-center justify-center gap-4">
                    <h2 className="text-xl font-bold text-primary">새로운 일정을 추가해보세요!</h2>
                    <p className="text-sm text-zinc-500">과 개강총회, 과 MT 등 다양한 일정을 추가할 수 있어요.</p>
                    <p className="text-sm text-zinc-500">여기를 클릭하여 추가하세요</p>
                </div>
            </ContentCard>
        </Link>
    );
}