"use client";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { EventSelect } from "@/features/event/components/EventSelect/EventSelect";
import { ActiveFormValues } from "@/schemas/schemas";
import type { UseFormRegister } from "react-hook-form";

interface ActiveFieldsProps {
    /** 부모의 useForm<ActiveFormValues>()에서 온 register */
    register: UseFormRegister<ActiveFormValues>;
    groupId: string;
    primaryColor: string;
    secondaryColor: string;
    /** 값이 있으면 소속 이벤트를 고르지 않고 이 이벤트로 고정한다 */
    lockedEventId?: string;
    /** 색이 바뀔 때 부모 상태로 끌어올리고 싶을 때만 전달 */
    onPrimaryColorChange?: (hex: string) => void;
    onSecondaryColorChange?: (hex: string) => void;
}

/** 액티브 생성/수정에서 공통으로 쓰는 입력 필드 묶음 */
export function ActiveFields({
    register,
    groupId,
    primaryColor,
    secondaryColor,
    lockedEventId,
    onPrimaryColorChange,
    onSecondaryColorChange,
}: ActiveFieldsProps) {
    return (
        <>
            <GetInputArea
                type="text"
                title="액티브 이름"
                description="액티브의 이름을 입력하세요."
                required={true}
                registration={register("name")}
            />
            <GetInputArea
                type="textarea"
                title="액티브 설명"
                description="액티브의 설명을 입력하세요."
                isLong={true}
                registration={register("description")}
            />
            <EventSelect groupId={groupId} registration={register("eventId")} lockedEventId={lockedEventId} />
            <GetInputArea
                type="color"
                title="기본 색상"
                description="액티브의 대표 색상을 선택하세요."
                defaultColor={primaryColor}
                onColorChange={onPrimaryColorChange}
                registration={register("primaryColor")}
            />
            <GetInputArea
                type="color"
                title="보조 색상"
                description="액티브의 보조 색상을 선택하세요."
                defaultColor={secondaryColor}
                onColorChange={onSecondaryColorChange}
                registration={register("secondaryColor")}
            />
            <GetInputArea type="datetime" title="시작 시간" description="액티브의 시작 시간을 선택하세요."/>
            <GetInputArea type="datetime" title="종료 시간" description="액티브의 종료 시간을 선택하세요." />
        </>
    );
}
