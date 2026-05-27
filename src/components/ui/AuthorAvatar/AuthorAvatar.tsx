import { cn } from "@/lib/cn";
import { User } from "lucide-react";
import React from "react";
import { ClassNameValue } from "tailwind-merge";

interface AuthorAvatarProps {
    imageUrl?: string | React.ReactNode;
    description?: string;
    size?: number | string;
    style?: ClassNameValue;
}


export default function AuthorAvatar({ imageUrl, description, size = 12, style }: AuthorAvatarProps) {
    return (
        <div className={cn(`flex w-${size} h-${size} shrink-0 aspect-square items-center justify-center overflow-hidden rounded-full`, `bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300`, style)}>
            {imageUrl ? <img className="w-full h-full object-cover" src={imageUrl as string} alt={description as string} /> : <User className="w-full h-full"/> }
        </div>
    );
}