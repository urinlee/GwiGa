"use client";
import { cn } from "@/lib/cn";


interface GetInputProps {
    label: string;
    placeholder?: string;
    required?: boolean;
    isLong?: boolean;
    maxLength?: number;
}

export default function GetInput({ label, placeholder, required, isLong, maxLength }: GetInputProps) {

    const InputStyle:string = `mt-3 w-full rounded-md border border-gray-300 dark:border-gray-500 px-4 py-2 focus:outline-none`;
    return (
        <div className="">
            <p className="ml-3 text-lg font-medium text-gray-600 dark:text-gray-200">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </p>
            {isLong ? (
                <textarea
                    placeholder={placeholder || "Type something..."}
                    required={required}
                    maxLength={maxLength}
                    className={cn(InputStyle, "h-32 resize-none")}
                />
            ) : (
                <input
                    type="text"
                    placeholder={placeholder || "Type something..."}
                    required={required}
                    maxLength={maxLength}
                    className={cn(InputStyle)}
                />
            )}

            {maxLength && (
                <div className="flex">
                    <span className="mt-1 ml-auto text-sm text-gray-500 dark:text-gray-400">
                        최대 {maxLength}자
                    </span>
                </div>
            )}
        </div>
    );
}