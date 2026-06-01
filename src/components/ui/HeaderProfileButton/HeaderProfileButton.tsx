"use client";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import AuthorAvatar from "../AuthorAvatar/AuthorAvatar";
import HeaderProfileMenu from "../HeaderProfileMenu/HeaderProfileMenu";

interface HeaderProfileButtonProps {
    imageUrl?: string | null;
    name?: string | null;
    handle?: string | null;
    menuAlign?: "left" | "right";
}

export default function HeaderProfileButton({
    imageUrl,
    name,
    handle,
    menuAlign = "right",
}: HeaderProfileButtonProps) {

    const [is_open, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handlePageShow = () => {
            setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("pageshow", handlePageShow);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);

    return (
        <div className="relative inline-flex" ref={menuRef}>
            <button
                aria-expanded={is_open}
                aria-haspopup="menu"
                aria-label="프로필 메뉴 열기"
                className="group flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 pr-2 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                onClick={() => setIsOpen(!is_open)}
                type="button"
            >
                <AuthorAvatar imageUrl={imageUrl || undefined} style="size-12" />
                <ChevronDown className={`size-4 text-zinc-500 transition-transform group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-100 ${is_open ? "rotate-180" : ""}`} />
            </button>
            {is_open && (
                <div
                    className={cn(
                        "absolute top-full z-20 mt-3 origin-top-right",
                        menuAlign === "left" ? "left-0" : "right-0",
                    )}
                    role="menu"
                >
                    <HeaderProfileMenu
                        handle={handle}
                        imageUrl={imageUrl}
                        name={name}
                    />
                </div>
            )}
        </div>

    );
}
