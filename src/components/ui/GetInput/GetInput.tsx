"use client";
import type { UseFormRegisterReturn } from "react-hook-form";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { EnterChoiceInput, type InputType, type ZonePropsByType } from "./EnterForm";
import { SettingContainer } from "../SettingContainer/SettingContainer";


// interface GetInputProps {
//     label: string;
//     name?: string
//     placeholder?: string;
//     required?: boolean;
//     isLong?: boolean;
//     maxLength?: number;
// }

// export default function GetInput({ label, name, placeholder, required, isLong, maxLength }: GetInputProps) {

//     const InputStyle:string = `mt-3 w-full rounded-md border border-gray-300 dark:border-gray-500 px-4 py-2 focus:outline-none`;
//     return (
//         <div className="">
//             <p className="ml-3 text-lg font-medium text-gray-600 dark:text-gray-200">
//                 {label}
//                 {required && <span className="text-red-500 ml-1">*</span>}
//             </p>
//             {isLong ? (
//                 <textarea
//                     name={name || label}
//                     placeholder={placeholder || "Type something..."}
//                     required={required}
//                     maxLength={maxLength}
//                     className={cn(InputStyle, "h-32 resize-none")}
//                 />
//             ) : (
//                 <input
//                     type="text"
//                     name={name || label}
//                     placeholder={placeholder || "Type something..."}
//                     required={required}
//                     maxLength={maxLength}
//                     className={cn(InputStyle)}
//                 />
//             )}

//             {maxLength && (
//                 <div className="flex">
//                     <span className="mt-1 ml-auto text-sm text-gray-500 dark:text-gray-400">
//                         최대 {maxLength}자
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// }


/** 라벨·설명·에러처럼 GetInputArea가 그리는 부분 */
export interface InputBaseProps {
    title: string;
    description?: string;
    required?: boolean;
    /** 사용하는 곳에서 register("이름", rules) 결과를 넘긴다 */
    registration?: UseFormRegisterReturn;
    /** 사용하는 곳에서 errors["이름"]?.message 를 넘긴다 */
    error?: string;
    width?: string;
}

export type GetInputProps = {
    [K in InputType]: { type: K } & InputBaseProps &
        Omit<ZonePropsByType[K], "registration" | "id" | "describedBy" | "hasError">;
}[InputType];


const TextAreaContainerStyle = "flex flex-col w-full items-start";

export function GetInputArea(props: GetInputProps) {
    const { type, title, description, required, registration, error, ...rest } = props;

    // 라벨·설명·에러를 입력과 이어주는 id. 같은 폼에 같은 종류가 여러 개 있어도 안 겹친다.
    const baseId = useId();
    const inputId = `${baseId}-input`;
    const descId = description ? `${baseId}-desc` : undefined;
    const errorId = error ? `${baseId}-error` : undefined;
    // 설명과 에러를 함께 읽어준다. 공백으로 이어 여러 개를 지정할 수 있다.
    const describedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

    const isLong = type === "textarea" && (rest as ZonePropsByType["textarea"]).isLong;
    const dateOnly = type === "datetime" && (rest as ZonePropsByType["datetime"]).dateOnly;

    return (
        <SettingContainer>
            <div className={cn("flex items-center", type === "textarea" && TextAreaContainerStyle)}>
                <div className="flex-1">
                    {/* label로 감싸야 제목을 눌렀을 때 입력으로 포커스가 간다 */}
                    <label htmlFor={inputId} className="font-semibold text-[18px] cursor-pointer">
                        {title}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {description && (
                        <p id={descId} className="mt-2 text-[12px] text-zinc-500">
                            {description}
                        </p>
                    )}
                </div>
                <div className={cn("flex mt-2 items-center justify-end",
                    type === "textarea" ? (isLong ? "w-full h-50" : "w-full h-10")
                        : type === "text" || type === "select" || type === "number" ? "w-80"
                        : type === "time" ? "w-60"
                        : type === "datetime" ? (dateOnly ? "w-60" : "w-80")
                        : "w-auto", props.width
                )}>
                    <div className="flex w-full h-full flex-col items-end">
                        <EnterChoiceInput
                            {...({
                                ...rest,
                                type,
                                registration,
                                id: inputId,
                                describedBy,
                                hasError: Boolean(error),
                            } as Parameters<typeof EnterChoiceInput>[0])}
                        />
                        {error && (
                            // role="alert"이라야 스크린리더가 에러 발생 즉시 읽어준다
                            <p id={errorId} role="alert" className="mt-1 text-xs text-red-500">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </SettingContainer>)
}