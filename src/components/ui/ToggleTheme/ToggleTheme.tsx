"use client";

import { useTheme } from "next-themes";
import { Lightbulb } from "lucide-react";

export default function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      aria-label="테마 변경"
      className="flex aspect-square cursor-pointer items-center justify-center rounded-full border bg-black p-4 text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-black"
      onClick={() => setTheme(nextTheme)}
      type="button"
    >
      <Lightbulb className="size-6" />
    </button>
  );
}
