
"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export interface MenuSelectprops {
    icon: React.ReactNode;
    title: string;
    href?: string;
    description?: string;
    isActive?: boolean;
}

interface MenuSidebarLayoutProps {
    menus: MenuSelectprops[];
    title?: string;
    className?: string;
    selectedMenu?: MenuSelectprops;
}



export function MenuSidebarLayout({ menus, title = "Menu", className, selectedMenu }: MenuSidebarLayoutProps) {
    const pathname = usePathname();

    const isPathActive = (href?: string) => {
        if (!href || !pathname) {
            return false;
        }

        const normalizedHref = href.endsWith("/") && href !== "/" ? href.slice(0, -1) : href;
        const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

        if (normalizedHref === "/") {
            return normalizedPath === "/";
        }

        return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
    };

    return (
        <aside className={cn("h-full w-full max-w-72 border-r border-zinc-200/70 bg-linear-to-b from-white to-zinc-50 dark:border-zinc-800/80 dark:from-zinc-950 dark:to-zinc-900", className)}>
            <div className="flex h-full flex-col">
                <div className="border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800/80">
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                        {title}
                    </h2>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={title}>
                    <ul className="space-y-1.5">
                        {menus.map((menu, index) => {
                            const isSelected = menu.isActive || selectedMenu === menu || isPathActive(menu.href);
                            const itemClassName = cn(
                                "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-all",
                                "hover:border-zinc-200 hover:bg-white hover:shadow-sm dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
                                isSelected && "border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900",
                            );

                            const content = (
                                <>
                                    <span
                                        className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors dark:bg-zinc-800 dark:text-zinc-300",
                                            isSelected && "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
                                        )}
                                        aria-hidden="true"
                                    >
                                        {menu.icon}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{menu.title}</span>
                                        {menu.description ? (
                                            <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">{menu.description}</span>
                                        ) : null}
                                    </span>
                                </>
                            );

                            return (
                                <li key={`${menu.title}-${index}`}>
                                    {menu.href ? (
                                        <Link href={menu.href} className={itemClassName}>
                                            {content}
                                        </Link>
                                    ) : (
                                        <div className={itemClassName}>{content}</div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}