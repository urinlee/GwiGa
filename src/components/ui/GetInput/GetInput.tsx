"use client";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/cn";
import { EnterChoiceInput } from "./EnterForm";
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


export interface InputBaseProps {
    title: string;
    description?:string;
    required?: boolean;
    /** 사용하는 곳에서 register("이름", rules) 결과를 넘긴다 */
    registration?: UseFormRegisterReturn;
    /** 사용하는 곳에서 errors["이름"]?.message 를 넘긴다 */
    error?: string;
}

export interface GetInputTextProps extends InputBaseProps {
    type: "text" ;
    defaultValue?: string;
    maxLength?: number;
    placeholder?: string;
}
// | "textarea" | "toggle" | "select" | "checkbox" | "radio"

export interface GetInputTextAreaProps extends InputBaseProps {
    type: "textarea";
    defaultValue?: string;
    maxLength?: number;
    isLong?: boolean;
    placeholder?: string;
}


export interface GetInputToggleProps extends InputBaseProps {
    type: "toggle";
}

export interface GetInputNumberProps extends InputBaseProps {
    type: "number";
}

export interface GetInputCheckboxProps extends InputBaseProps {
    type: "checkbox";
}

export interface GetInputSelectProps extends InputBaseProps {
    type: "select";
    options?: string[];
}

export interface GetInputRadioProps extends InputBaseProps {
    type: "radio";
    options?: string[];
}

export interface GetInputColorProps extends InputBaseProps {
    type: "color";
    defaultColor?: string;
    onColorChange?: (hex: string) => void;
}

export interface GetInputTimeProps extends InputBaseProps {
    type: "time";
    /** "HH:MM" 형식 */
    defaultValue?: string;
    /** 초 단위 정밀도가 필요하면 1, 기본은 분 단위 */
    step?: number;
}

export interface GetInputDateTimeProps extends InputBaseProps {
    type: "datetime";
    /** dateOnly면 "YYYY-MM-DD", 아니면 "YYYY-MM-DDTHH:MM" */
    defaultValue?: string;
    /** true면 시간 없이 날짜만 입력받는다 */
    dateOnly?: boolean;
    /** 초 단위 정밀도가 필요하면 1 (dateOnly일 땐 무시됨) */
    step?: number;
}

export type GetInputProps = GetInputTextProps | GetInputTextAreaProps | GetInputSelectProps | GetInputToggleProps | GetInputCheckboxProps | GetInputRadioProps | GetInputNumberProps | GetInputColorProps | GetInputTimeProps | GetInputDateTimeProps;


const TextAreaContainerStyle = "flex flex-col w-full items-start";

export function GetInputArea(props: GetInputProps) {
    const { type, title, description, required, registration, error, ...rest } = props;

    return (
        <SettingContainer>
            <div className={cn("flex items-center", type === "textarea" && TextAreaContainerStyle)}>
                <div className="flex-1">
                    <h3 className="font-semibold text-[18px]">
                        {title}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    <p className="mt-2 text-[12px] text-zinc-500">
                        {description}
                    </p>
                </div>
                <div className={cn("flex mt-2 items-center justify-end",
                    type === "textarea" ? ((rest as GetInputTextAreaProps).isLong ? "w-full h-50" : "w-full h-10")
                        : type === "text" || type === "select" || type === "number" ? "w-150"
                        : type === "time" ? "w-60"
                        : type === "datetime" ? ((rest as GetInputDateTimeProps).dateOnly ? "w-60" : "w-80")
                        : "w-auto"
                )}>
                    <div className="flex w-full h-full flex-col items-end">
                        <EnterChoiceInput type={type} registration={registration} {...rest} />
                        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                    </div>
                </div>
            </div>
        </SettingContainer>)
}