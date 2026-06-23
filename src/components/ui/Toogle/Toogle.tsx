"use client";
import { useState } from "react";

interface ToogleProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Toogle({ checked: controlledChecked, defaultChecked = false, onChange, label, disabled = false }: ToogleProps) {
    const isControlled = controlledChecked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const checked = isControlled ? controlledChecked : internalChecked;

    const handleToggle = () => {
        if (disabled) return;
        const next = !checked;
        if (!isControlled) {
            setInternalChecked(next);
        }
        onChange?.(next);
    };

    return (
        <label className={`inline-flex items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
            <div className="relative" onClick={handleToggle}>
                <div
                    className={`h-6 w-11 rounded-full transition-colors duration-200 ${
                        checked ? "bg-button-bg" : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                />
                <div
                    className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        checked ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                />
            </div>
            {label && (
                <span className="text-sm font-medium text-text-primary select-none">
                    {label}
                </span>
            )}
        </label>
    );
}
