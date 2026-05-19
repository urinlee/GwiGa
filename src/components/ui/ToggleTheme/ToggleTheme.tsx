"use client";

import { useTheme } from "next-themes";
import {Lightbulb} from "lucide-react";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex">
        <div className={`items-center gap-4 border p-4 rounded-full aspect-square cursor-pointer ${theme === "light" ? "bg-black" : "bg-white"}`} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Lightbulb className={`w-6 h-6 ${theme === "light" ? "text-white" : "text-black"}`} />
        </div>
        
    </div>
  );
}