import { ChevronLeft} from "lucide-react";
import { MenuSelectprops, MenuSidebarLayout } from "../MenuSidebar/MenuSidebar";
import Link from "next/link";


interface ReturnButtonProps {
    href: string;
    label: string;
}


interface SettingLayoutProps {
    children: React.ReactNode;
    menuLabel?: string;
    menus: MenuSelectprops[];
    returnButton?: ReturnButtonProps;
}

export function SettingLayout({ children, menuLabel, menus, returnButton }: SettingLayoutProps) {
    return (
        <div className="flex h-screen w-full overflow-hidden">
        <div className="w-72 h-full">
            {/* <SidebarBackLink /> */}
            {returnButton && 
                <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
                    <Link
                        href={returnButton.href}
                        className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <span><ChevronLeft size={15} className="mr-2" /></span> {returnButton.label}
                    </Link>
                </div>
            }
            <MenuSidebarLayout title={menuLabel} menus={menus} />
        </div>
        <main className="flex-1 min-w-0 overflow-y-auto p-6">{children}</main>
    </div>
    );
}