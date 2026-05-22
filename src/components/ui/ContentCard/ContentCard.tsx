import { cn } from "@/lib/cn";
import { ClassValue } from "clsx";


const CARD_CLASS_NAME = "flex rounded-[20px] border border-zinc-200 bg-zinc-100 px-6 py-4 shadow-sm shadow-zinc-900/5 transition-colors sm:px-8 lg:px-10 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-zinc-950/20";

export default function ContentCard({ children, style }: { children: React.ReactNode, style?: ClassValue }) {
    return (
       <article
        data-testid="history-content-section"
        className={cn(CARD_CLASS_NAME, style)}
        >
            {children}
        </article>
    )
}