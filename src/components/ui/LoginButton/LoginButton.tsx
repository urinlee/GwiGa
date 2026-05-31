import { cn } from "@/lib/cn";
import { ClassValue } from "clsx";


// type backgroundColor = 'bg-${string}';
// type textColor = 'text-${string}';
// type darkModeBackgroundColor = 'dark:bg-${string}';
// type darkModeTextColor = 'dark:text-${string}';

// interface LoginButtonProps {
//     iconPath?: Path;
//     text?: string;
//     backgroundColor?: backgroundColor;
//     textColor?: textColor;
//     darkModeBackgroundColor?: darkModeBackgroundColor;
//     darkModeTextColor?: darkModeTextColor;

// }

interface LoginButtonProps {
    text?: string;
    iconPath?: string;
    style?: ClassValue;
    onClick?: () => void;
}


export default function LoginButton(
    {iconPath, text, style, onClick}: LoginButtonProps
) {
    return(
        <button className={cn("cursor-pointer px-5 py-5 box-border flex w-full items-center justify-center border border-zinc-400 transition-all duration-100","hover:brightness-95", style)} onClick={onClick}>
            {iconPath && <img src={iconPath} alt="login icon" className="w-8 h-8 mr-4"/>}
            <span className="text-2xl font-semibold">{text}</span>
        </button>
    )
}