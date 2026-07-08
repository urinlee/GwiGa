"use client";
import { cn } from "@/lib/cn";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { Modal, ModalContent } from "../Modal/Modal";

export type InputType = "text" | "textarea" | "select" | "toggle" | "checkbox" | "radio" | "number" | "color";

export interface InputProps {
    type: InputType;
    /** 사용하는 곳에서 register("이름", rules) 결과를 넘긴다 */
    registration?: UseFormRegisterReturn;
}

export interface ChoiceInputProps extends Omit<InputProps, "type"> {
    options?: string[];
}

type ZoneProps = Omit<InputProps, "type">;

const inputClassName = "w-full rounded-md border border-gray-400 dark:border-gray-500 px-4 py-2 focus:outline-none";

export function EnterTextZone({ registration}: ZoneProps) {
    return (
        <input
            className={inputClassName}
            {...registration}
        />
    );
}

export function EnterTextAreaZone({ registration}: ZoneProps) {
    return (
        <textarea
            className={cn(inputClassName, "h-full resize-none")}
            {...registration}
        />
    );
}

export function EnterToggleZone({ registration }: ZoneProps) {
    return (
        <label className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...registration} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
    );
}

export function EnterCheckboxZone({ registration }: ZoneProps) {
    return (
        <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" {...registration} />
        </label>
    );
}

export function EnterSelectZone({ registration, options = [] }: ChoiceInputProps) {
    return (
        <select className={inputClassName} {...registration}>
            <option value="">선택하세요</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}


export function EnterRadioZone({ registration, options = [] }: ChoiceInputProps) {
    return (
        <div className="flex gap-4">
            {options.map((option) => (
                <label key={option} className="inline-flex items-center gap-1.5">
                    <input
                        type="radio"
                        value={option}
                        className="form-radio h-5 w-5 text-blue-600"
                        {...registration}
                    />
                    <span className="text-sm">{option}</span>
                </label>
            ))}
        </div>
    );
}


export function EnterNumberZone({ registration}: ZoneProps) {
    return (
        <input
            type="number"
            className={inputClassName}
            {...registration}
        />
    );
}

export interface ColorZoneProps extends ZoneProps {
    defaultColor?: string;
    onColorChange?: (hex: string) => void;
}

export function EnterColorZone({ registration, defaultColor = "#3B82F6", onColorChange }: ColorZoneProps) {
    const [color, setColor] = useState(defaultColor);
    const [open, setOpen] = useState(false);

    const commit = (next: string) => {
        setColor(next);
        onColorChange?.(next);
        // react-hook-form 연동(선택): register 결과가 있으면 값 변경을 알린다
        void registration?.onChange({ target: { name: registration.name, value: next } } as never);
    };

    return (
        <>
            <button
                type="button"
                aria-label="색상 선택"
                onClick={() => setOpen(true)}
                className="h-14 w-14 rounded-xl border border-black/10 shadow-sm transition-transform hover:scale-105 active:scale-95 dark:border-white/15"
                style={{ backgroundColor: color }}
            />
            {registration && (
                <input type="hidden" name={registration.name} ref={registration.ref} value={color} readOnly />
            )}
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <ModalContent backgroundColor="" className="bg-white dark:bg-zinc-900">
                    <ColorPicker value={color} onChange={commit} />
                </ModalContent>
            </Modal>
        </>
    );
}

export function EnterChoiceInput({ type, ...rest }: InputProps) {
    switch (type) {
        case "text":
            return <EnterTextZone {...rest} />;
        case "number":
            return <EnterNumberZone {...rest} />;
        case "textarea":
            return <EnterTextAreaZone {...rest} />;
        case "select":
            return <EnterSelectZone {...rest} />;
        case "toggle":
            return <EnterToggleZone {...rest} />;
        case "checkbox":
            return <EnterCheckboxZone {...rest} />;
        case "radio":
            return <EnterRadioZone {...rest} />;
        case "color":
            return <EnterColorZone {...rest} />;
        default:
            return null;
    }
}
