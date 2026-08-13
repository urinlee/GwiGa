"use client"

import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import type { UseFormRegisterReturn } from "react-hook-form";

/** GetInputArea에 그대로 넘어가는 한 필드분 연결 정보 */
export interface RecruitField {
    registration?: UseFormRegisterReturn;
    error?: string;
}

export type RecruitFieldName = "startAt" | "endAt" | "description";

export interface NewRecruitFormProps {
    // 경로 조립을 부모에게 맡겨야 이벤트 폼의 recruit.startAt과 모집 단독 폼의 startAt에 같이 쓸 수 있다.
    /** 필드 이름을 부모 폼의 경로로 바꿔 registration·error를 돌려준다 */
    bind: (name: RecruitFieldName) => RecruitField;
    className?: string;
}

/** 이벤트 폼 안에 들어가야 해서 form이 아니라 필드 묶음만 그린다. 제출은 감싸는 폼이 맡는다. */
export function NewRecruitForm({ bind, className }: NewRecruitFormProps) {
    return (
        <div className={className}>
            <GetInputArea type="datetime" title="모집 시작 기간" description="모집 시작 기간을 입력하시오" width="w-100" {...bind("startAt")}/>
            <GetInputArea type="datetime" title="모집 종료 기간" description="모집 종료 기간을 입력하시오" width="w-100" {...bind("endAt")}/>
            <GetInputArea type="textarea" title="모집 유의사항" description="모집 유의사항은 신청시 모달 형식으로 나옵니다." isLong {...bind("description")}/>
        </div>
    )
}
