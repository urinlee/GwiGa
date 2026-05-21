"use client";
import { useTheme } from "next-themes";
import {Lightbulb} from "lucide-react";
import { useEffect } from "react";

export default function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  
  return (
    <div className="flex">
        {/* <div className={`items-center gap-4 border p-4 rounded-full aspect-square cursor-pointer ${resolvedTheme === "light" ? "bg-black" : "bg-white"}`} onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}> */}
        <div className={`items-center gap-4 border p-4 rounded-full aspect-square cursor-pointer bg-black dark:bg-white`} onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}>
            {/* <Lightbulb className={`w-6 h-6 ${resolvedTheme === "light" ? "text-white" : "text-black"}`} /> */}
            <Lightbulb className={`w-6 h-6 text-white dark:text-black`} />
        </div>
        
    </div>
  );
}