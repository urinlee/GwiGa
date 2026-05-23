import { cn } from "@/lib/cn";
import { participateContentStatus, participateStatusClasses } from "@/types/status";
import { User } from "lucide-react";

export interface ParticipantsInfoCardProps {
    username: string;
    allStatus: (participateContentStatus | string)[];
    enableStatus: participateContentStatus[];
}

const notIncludeStatusClasses = "text-gray-500 dark:text-gray-200";

export default function ParticipantInfoCard({ username, enableStatus, allStatus }: ParticipantsInfoCardProps) {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-300 bg-white py-4 px-2 text-center text-sm font-medium text-zinc-800 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100">
                <div className="flex w-15 mx-5 aspect-square rounded-full items-center justify-center bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300 overflow-hidden">
                    <User className="size-8"/>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="">{username}</span>
                </div>
                <div className="grid grid-cols-2 odd:justify-start even:justify-end w-full gap-y-2">
                    { allStatus.map((status, index) => {
                        return (
                        // 카드에 Status 상태 표시
                        <span 
                            key={status + index.toString()} 
                            className={cn("text-[13px] font-bold", "text-zinc-300 dark:text-zinc-600", 
                                enableStatus.includes(status as participateContentStatus) && ((Object.prototype.hasOwnProperty.call(participateStatusClasses, status)) ? participateStatusClasses[status as participateContentStatus] : notIncludeStatusClasses)
                            )}
                        >
                            {status}
                        </span>
                        )
                    }) }
                </div>
            </div>
        </div>
    )
}