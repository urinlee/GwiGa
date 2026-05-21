"use client";

import type { ReactNode } from "react";

interface ButtonProps {
  title: string;
  callback?: () => void;
  icon?: ReactNode;
}

export default function Button({ title, callback, icon }: ButtonProps) {
  return (
    <button
      className="cursor-pointer rounded-md bg-button-bg px-4 py-2 font-semibold text-text-force-primary transition-opacity hover:opacity-90"
      onClick={callback}
      type="button"
    >
      <span className="flex items-center gap-2">
        {icon ? <span className="flex items-center">{icon}</span> : null}
        <span className="leading-none">{title}</span>
      </span>
    </button>
  );
}
