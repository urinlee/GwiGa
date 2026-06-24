"use client";
import { cn } from "@/lib/cn";
import { participateBgStatusClasses, participateContentStatus } from "@/types/status";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";

interface CreateStatusListProps {
    defaultStatusList?: participateContentStatus[];
}

export default function CreateStatusList({ defaultStatusList }: CreateStatusListProps) {

    const [statusList, setStatusList] = useState<participateContentStatus[]>(defaultStatusList || []);
    const InputRef = useRef<HTMLInputElement>(null);

    const handleAddStatus = (newStatus: participateContentStatus) => {
        if (newStatus.trim() === "") return;
        if (statusList.includes(newStatus)) return;
        setStatusList((prevList) => [...prevList, newStatus]);
    }

    const handleButtonClick = () => {
        const newStatus = InputRef.current?.value as participateContentStatus;
        if (newStatus) {
            handleAddStatus(newStatus);
            if (InputRef.current) {
                InputRef.current.value = "";
            }
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                {statusList.map((status, index) => {
                    const statusClass = participateBgStatusClasses[status as keyof typeof participateBgStatusClasses] ?? "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300";
                    return (
                        <div key={index + "status"} className="inline" >
                            <input type="hidden" name="RoomStatus" value={status} />
                            <button
                                type="button"
                                onClick={() => setStatusList((prev) => prev.filter((_, i) => i !== index))}
                                className={cn("group flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium cursor-pointer", statusClass)}
                            >
                                <span className="relative flex size-2.5 shrink-0">
                                    <span className="absolute inset-0 rounded-full bg-current opacity-100 transition-opacity group-hover:opacity-0" />
                                    <X className="absolute inset-0 size-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </span>
                                {status}
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    className="flex-1 min-w-0 rounded-md border border-gray-300 dark:border-gray-500 px-4 py-2 bg-transparent focus:outline-none text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    placeholder="상태 추가"
                    ref={InputRef}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); handleButtonClick(); } }}
                />
                <button
                    className="px-6 py-2 bg-emerald-200 rounded-2xl border border-emerald-500 text-emerald-500 font-extrabold"
                    onClick={handleButtonClick}>
                    <Plus strokeWidth={3} size={20}/>
                </button>
            </div>
        </div>
    )
}
