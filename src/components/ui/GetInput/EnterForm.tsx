"use client";
import { cn } from "@/lib/cn";
import type { ClassValue } from "clsx";
import { Calendar, CalendarClock, Clock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { Modal, ModalContent } from "../Modal/Modal";

export type InputType = "text" | "textarea" | "select" | "toggle" | "checkbox" | "radio" | "number" | "color" | "time" | "datetime";

/**
 * 모든 Zone이 공통으로 받는 것.
 * 아래 타입들이 입력 종류별 prop의 유일한 정의처다. GetInput.tsx는 이걸 재사용한다
 * — 양쪽에서 따로 선언하면 한쪽에만 추가된 prop이 조용히 무시된다.
 */
export interface ZoneBaseProps {
    /** 사용하는 곳에서 register("이름", rules) 결과를 넘긴다 */
    registration?: UseFormRegisterReturn;
    /** label과 연결할 id. GetInputArea가 자동으로 넣는다 */
    id?: string;
    /** 설명·에러 문단의 id. 스크린리더가 입력과 함께 읽는다 */
    describedBy?: string;
    /** 에러 상태면 테두리를 붉게 하고 aria-invalid를 켠다 */
    hasError?: boolean;
}

export interface TextZoneProps extends ZoneBaseProps {
    defaultValue?: string;
    maxLength?: number;
    placeholder?: string;
}

export interface TextAreaZoneProps extends TextZoneProps {
    isLong?: boolean;
}

export interface ChoiceInputProps extends ZoneBaseProps {
    options?: string[];
}

export interface NumberZoneProps extends ZoneBaseProps {
    /** true면 음수를 막는다 (min=0 + 음수 기호 입력 차단) */
    positiveOnly?: boolean;
    /** 값을 비우는 X 버튼을 숨긴다 */
    hideClear?: boolean;
}

export interface TimeZoneProps extends ZoneBaseProps {
    /** "HH:MM" 형식 */
    defaultValue?: string;
    /** 초 단위 정밀도가 필요하면 1, 기본은 분 단위 */
    step?: number;
}

export interface DateTimeZoneProps extends ZoneBaseProps {
    /** dateOnly면 "YYYY-MM-DD", 아니면 "YYYY-MM-DDTHH:MM" */
    defaultValue?: string;
    /** true면 시간 없이 날짜만 입력받는다 */
    dateOnly?: boolean;
    /** 초 단위 정밀도가 필요하면 1 (dateOnly일 땐 무시됨) */
    step?: number;
}

export interface ColorZoneProps extends ZoneBaseProps {
    defaultColor?: string;
    onColorChange?: (hex: string) => void;
}

/** type별로 어떤 prop을 받는지 한 곳에 모은 표. GetInput.tsx가 이걸 그대로 쓴다. */
export type ZonePropsByType = {
    text: TextZoneProps;
    textarea: TextAreaZoneProps;
    select: ChoiceInputProps;
    radio: ChoiceInputProps;
    toggle: ZoneBaseProps;
    checkbox: ZoneBaseProps;
    number: NumberZoneProps;
    color: ColorZoneProps;
    time: TimeZoneProps;
    datetime: DateTimeZoneProps;
};

/** EnterChoiceInput이 받는 판별 유니온 */
export type InputProps = {
    [K in InputType]: { type: K } & ZonePropsByType[K];
}[InputType];

const inputClassName =
    "w-full rounded-md border px-4 py-2 transition-colors " +
    // outline을 없앤 자리를 테두리 강조가 대신한다. 없으면 키보드 사용자가 현재 위치를 잃는다.
    // 링을 띄우는 대신 테두리를 진하게 해 프로젝트의 zinc 톤과 어긋나지 않게 한다.
    "focus:outline-none focus-visible:border-zinc-900 dark:focus-visible:border-zinc-100";

const borderClassName = "border-gray-400 dark:border-gray-500";
const errorBorderClassName = "border-red-500 dark:border-red-500 focus-visible:border-red-600 dark:focus-visible:border-red-400";

/** 입력 테두리 + 포커스 강조. 에러면 붉게. */
function fieldClass(hasError?: boolean, extra?: ClassValue) {
    return cn(inputClassName, hasError ? errorBorderClassName : borderClassName, extra);
}

/** 모든 네이티브 입력이 공유하는 접근성 속성 */
function a11yProps({ id, describedBy, hasError }: ZoneBaseProps) {
    return {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": hasError || undefined,
    };
}

export function EnterTextZone({ registration, placeholder, defaultValue, maxLength, ...a11y }: TextZoneProps) {
    return (
        <input
            className={fieldClass(a11y.hasError)}
            placeholder={placeholder}
            defaultValue={defaultValue}
            maxLength={maxLength}
            {...a11yProps(a11y)}
            {...registration}
        />
    );
}

export function EnterTextAreaZone({ registration, placeholder, defaultValue, maxLength, ...a11y }: TextAreaZoneProps) {
    return (
        <textarea
            className={fieldClass(a11y.hasError, "h-full resize-none")}
            placeholder={placeholder}
            defaultValue={defaultValue}
            maxLength={maxLength}
            {...a11yProps(a11y)}
            {...registration}
        />
    );
}

export function EnterToggleZone({ registration, ...a11y }: ZoneBaseProps) {
    return (
        <label className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...a11yProps(a11y)} {...registration} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900 peer-focus-visible:ring-offset-1 dark:peer-focus-visible:ring-zinc-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
    );
}

export function EnterCheckboxZone({ registration, ...a11y }: ZoneBaseProps) {
    return (
        <label className="inline-flex items-center">
            <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                {...a11yProps(a11y)}
                {...registration}
            />
        </label>
    );
}

export function EnterSelectZone({ registration, options = [], ...a11y }: ChoiceInputProps) {
    return (
        <select className={fieldClass(a11y.hasError)} {...a11yProps(a11y)} {...registration}>
            <option value="">선택하세요</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}


export function EnterRadioZone({ registration, options = [], ...a11y }: ChoiceInputProps) {
    // 라디오 그룹은 개별 input에 id를 붙이면 label과 1:1이 깨진다.
    // 대신 그룹 컨테이너가 role/aria를 갖는다.
    return (
        <div
            role="radiogroup"
            aria-describedby={a11y.describedBy}
            aria-invalid={a11y.hasError || undefined}
            className="flex gap-4"
        >
            {options.map((option) => (
                <label key={option} className="inline-flex items-center gap-1.5">
                    <input
                        type="radio"
                        value={option}
                        className="form-radio h-5 w-5 text-blue-600 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                        {...registration}
                    />
                    <span className="text-sm">{option}</span>
                </label>
            ))}
        </div>
    );
}


export function EnterNumberZone({ registration, positiveOnly, hideClear, ...a11y }: NumberZoneProps) {
    // register가 넘겨준 ref를 우리도 써야 해서 갈라 받는다.
    // (지우기 버튼이 DOM 값을 직접 비우고 RHF에도 알려야 하기 때문)
    const { ref, onChange, ...restRegistration } = registration ?? {};
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const handleClear = () => {
        const el = inputRef.current;
        if (!el) return;
        el.value = "";
        // RHF은 DOM을 직접 바꾼 걸 모른다. change 이벤트를 만들어 알려준다.
        onChange?.({ target: el, type: "change" });
        setIsEmpty(true);
        el.focus();
    };

    return (
        <div className="relative w-full">
            <input
                type="number"
                min={positiveOnly ? 0 : undefined}
                className={fieldClass(a11y.hasError, !hideClear && "pr-9")}
                {...a11yProps(a11y)}
                // register의 ref와 우리 ref를 함께 연결한다.
                // React 19의 ref 콜백은 정리 함수를 돌려주는 방식이 권장된다.
                ref={(el: HTMLInputElement | null) => {
                    inputRef.current = el;
                    ref?.(el);
                    return () => {
                        inputRef.current = null;
                        ref?.(null);
                    };
                }}
                onChange={(e) => {
                    setIsEmpty(e.target.value === "");
                    onChange?.(e);
                }}
                onKeyDown={(e) => {
                    // type=number는 "-"를 허용하므로 키 입력 단계에서 막는다.
                    if (positiveOnly && (e.key === "-" || e.key === "e")) e.preventDefault();
                }}
                {...restRegistration}
            />
            {!hideClear && !isEmpty && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="입력값 지우기"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export function EnterTimeZone({ registration, defaultValue, step, ...a11y }: TimeZoneProps) {
    return (
        <div className="relative w-full">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
                type="time"
                step={step}
                defaultValue={defaultValue}
                // 다크모드에서 네이티브 시계 피커/텍스트가 어둡게 렌더되도록
                className={fieldClass(a11y.hasError, "pl-10 dark:[color-scheme:dark]")}
                {...a11yProps(a11y)}
                {...registration}
            />
        </div>
    );
}

export function EnterDateTimeZone({ registration, defaultValue, dateOnly, step, ...a11y }: DateTimeZoneProps) {
    const Icon = dateOnly ? Calendar : CalendarClock;
    return (
        <div className="relative w-full">
            <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
                type={dateOnly ? "date" : "datetime-local"}
                step={dateOnly ? undefined : step}
                defaultValue={defaultValue}
                // 다크모드에서 네이티브 달력 피커/텍스트가 어둡게 렌더되도록
                className={fieldClass(a11y.hasError, "pl-10 dark:[color-scheme:dark]")}
                {...a11yProps(a11y)}
                {...registration}
            />
        </div>
    );
}

export function EnterColorZone({ registration, defaultColor = "#3B82F6", onColorChange, ...a11y }: ColorZoneProps) {
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
                id={a11y.id}
                aria-describedby={a11y.describedBy}
                onClick={() => setOpen(true)}
                className={cn(
                    "h-14 w-14 rounded-xl border shadow-sm transition-transform hover:scale-105 active:scale-95",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1 dark:focus-visible:ring-zinc-100",
                    a11y.hasError ? "border-red-500" : "border-black/10 dark:border-white/15",
                )}
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

/**
 * type에 따라 알맞은 Zone을 고른다.
 * props가 판별 유니온이라, 각 분기 안에서는 그 타입 전용 prop만 통과한다.
 */
export function EnterChoiceInput(props: InputProps) {
    switch (props.type) {
        case "text":
            return <EnterTextZone {...props} />;
        case "number":
            return <EnterNumberZone {...props} />;
        case "textarea":
            return <EnterTextAreaZone {...props} />;
        case "select":
            return <EnterSelectZone {...props} />;
        case "toggle":
            return <EnterToggleZone {...props} />;
        case "checkbox":
            return <EnterCheckboxZone {...props} />;
        case "radio":
            return <EnterRadioZone {...props} />;
        case "color":
            return <EnterColorZone {...props} />;
        case "time":
            return <EnterTimeZone {...props} />;
        case "datetime":
            return <EnterDateTimeZone {...props} />;
        default:
            return null;
    }
}
