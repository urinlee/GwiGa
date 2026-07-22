"use client";
import type { Active } from "@/generated/prisma/client";
import type { MemberActiveItem } from "@/schemas/schemas";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";

interface MemberActiveDetailValues {
    enable: boolean;
    startAt: string; // "YYYY-MM-DD" | ""
    endAt: string;
}

const dateToInput = (d: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const inputToDate = (v: string) => (v ? new Date(v) : null);

interface MemberActiveDetailFormProps {
    /** 표시용 액티브(이름·색상) */
    active: Active;
    /** 현재 draft 값 */
    value: MemberActiveItem;
    /** 변경 시 부모 draft에 반영 (일괄 저장은 부모가 담당) */
    onChange: (patch: Partial<MemberActiveItem>) => void;
}

/**
 * 선택된 액티브의 "이 멤버만의 설정"을 편집하는 폼.
 * 부모에서 `key={activeId}`로 렌더해 액티브가 바뀌면 그 값으로 재초기화된다.
 */
export function MemberActiveDetailForm({ active, value, onChange }: MemberActiveDetailFormProps) {
    const { register } = useForm<MemberActiveDetailValues>({
        defaultValues: {
            enable: value.enable,
            startAt: dateToInput(value.startAt),
            endAt: dateToInput(value.endAt),
        },
    });

    return (
        <div className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
            <div className="mb-2 flex items-center gap-2 px-1">
                <span
                    className="h-5 w-5 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/15"
                    style={{ backgroundColor: active.primaryColor ?? "#F4F4F5" }}
                />
                <span className="text-lg font-bold">{active.name}</span>
                <span className="text-sm text-zinc-500">멤버별 설정</span>
            </div>

            <GetInputArea
                type="toggle"
                title="활성화"
                description="이 멤버에게 이 액티브를 켜둘지 여부"
                registration={register("enable", {
                    onChange: (e: ChangeEvent<HTMLInputElement>) => onChange({ enable: e.target.checked }),
                })}
            />
            <GetInputArea
                type="datetime"
                dateOnly
                title="시작일"
                description="이 멤버의 액티브 시작일"
                registration={register("startAt", {
                    onChange: (e: ChangeEvent<HTMLInputElement>) => onChange({ startAt: inputToDate(e.target.value) }),
                })}
            />
            <GetInputArea
                type="datetime"
                dateOnly
                title="종료일"
                description="이 멤버의 액티브 종료일"
                registration={register("endAt", {
                    onChange: (e: ChangeEvent<HTMLInputElement>) => onChange({ endAt: inputToDate(e.target.value) }),
                })}
            />
        </div>
    );
}
