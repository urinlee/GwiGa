"use client"
import { Hash, Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";


interface CreateTagsListProps {
    tags?: string[];
    registration?: any; // react-hook-form의 register("이름", rules) 결과를 넘긴다
}

export default function CreateTagsList({ tags, registration }: CreateTagsListProps) {
    const [isChange, setIsChange] = useState(false);
    const [tagState, setTagState] = useState<string[]>(tags || []);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleAddTag = (tagName:string) => {
        if (tagName.trim() === "") return;
        if (tagState.includes(tagName)) return;
        setTagState((prev)=>([...prev, tagName.trim()]))
    }

    const handleButtonClick = () => {
        setIsChange(true);
        const inputValue = inputRef.current?.value;
        if (inputValue){
            handleAddTag(inputValue);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    }
    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-5">
                {registration && <input type="hidden" {...registration} value={isChange} />}
                {tagState?.map((value, index) => (
                    <div key={value} className="group flex gap-1 items-center">
                        <input
                            type="hidden"
                            name="RoomTag"
                            value={value} />
                        <div className="size-5" onClick={() => setTagState((prev) => prev.filter((_, i) => i !== index))}>
                            <div className="relative flex shrink-0">
                                <Hash className="absolute size-5 inset-0 group-hover:opacity-0 text-text-primary" />
                                <X className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        </div>
                        <div className="text-text-primary">{value}</div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder="태그 입력..."
                    className="flex-1 min-w-0 rounded-md border border-gray-300 dark:border-gray-500 px-4 py-2 bg-transparent focus:outline-none text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); handleButtonClick(); } }}/>
                <button
                    className="px-6 py-2 bg-emerald-200 rounded-2xl border border-emerald-500 text-emerald-500 font-extrabold"
                    disabled={tagState.length >= 10}
                    onClick={handleButtonClick}>
                    <Plus strokeWidth={3} size={20}/>
                </button>
            </div>
        </div>
    )
}