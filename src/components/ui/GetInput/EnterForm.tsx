"use client";
import { cn } from "@/lib/cn";
import { Calendar, CalendarClock, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { Modal, ModalContent } from "../Modal/Modal";

export type InputType = "text" | "textarea" | "select" | "toggle" | "checkbox" | "radio" | "number" | "color" | "time" | "datetime";

export interface InputProps {
    type: InputType;
    /** 사용하는 곳에서 register("이름", rules) 결과를 넘긴다 */
    registration?: UseFormRegisterReturn;
    /** text / textarea에서만 사용된다 */
    placeholder?: string;
}

export interface ChoiceInputProps extends Omit<InputProps, "type"> {
    options?: string[];
}

type ZoneProps = Omit<InputProps, "type">;

const inputClassName = "w-full rounded-md border border-gray-400 dark:border-gray-500 px-4 py-2 focus:outline-none";

export function EnterTextZone({ registration, placeholder }: ZoneProps) {
    return (
        <input
            className={inputClassName}
            placeholder={placeholder}
            {...registration}
        />
    );
}

export function EnterTextAreaZone({ registration, placeholder }: ZoneProps) {
    return (
        <textarea
            className={cn(inputClassName, "h-full resize-none")}
            placeholder={placeholder}
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

export interface TimeZoneProps extends ZoneProps {
    /** "HH:MM" 형식 */
    defaultValue?: string;
    /** 초 단위 정밀도가 필요하면 1, 기본은 분 단위 */
    step?: number;
}

export function EnterTimeZone({ registration, defaultValue, step }: TimeZoneProps) {
    return (
        <div className="relative w-full">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
                type="time"
                step={step}
                defaultValue={defaultValue}
                // 다크모드에서 네이티브 시계 피커/텍스트가 어둡게 렌더되도록
                className={cn(inputClassName, "pl-10 dark:[color-scheme:dark]")}
                {...registration}
            />
        </div>
    );
}

export interface DateTimeZoneProps extends ZoneProps {
    /** dateOnly면 "YYYY-MM-DD", 아니면 "YYYY-MM-DDTHH:MM" */
    defaultValue?: string;
    /** true면 시간 없이 날짜만 입력받는다 */
    dateOnly?: boolean;
    /** 초 단위 정밀도가 필요하면 1 (dateOnly일 땐 무시됨) */
    step?: number;
}

export function EnterDateTimeZone({ registration, defaultValue, dateOnly, step }: DateTimeZoneProps) {
    const Icon = dateOnly ? Calendar : CalendarClock;
    return (
        <div className="relative w-full">
            <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
                type={dateOnly ? "date" : "datetime-local"}
                step={dateOnly ? undefined : step}
                defaultValue={defaultValue}
                // 다크모드에서 네이티브 달력 피커/텍스트가 어둡게 렌더되도록
                className={cn(inputClassName, "pl-10 dark:[color-scheme:dark]")}
                {...registration}
            />
        </div>
    );
}

export interface ColorZoneProps extends ZoneProps {
    defaultColor?: string;
    onColorChange?: (hex: string) => void;
}

export function EnterColorZone({ registration, defaultColor = "#3B82F6", onColorChange }: ColorZoneProps) {
    const [color, setColor] = useState(defaultColor);
    const [open, setOpen] = useState(false);

    // 바깥에서 색이 바뀌면(예: 선택된 항목 변경, 서버 데이터 도착) 스와치도 따라간다
    useEffect(() => {
        setColor(defaultColor);
    }, [defaultColor]);

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
        case "time":
            return <EnterTimeZone {...rest} />;
        case "datetime":
            return <EnterDateTimeZone {...rest} />;
        default:
            return null;
    }
}
