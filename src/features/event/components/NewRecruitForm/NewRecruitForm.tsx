"use client"

import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

/** GetInputArea에 그대로 넘어가는 한 필드분 연결 정보 */
export interface RecruitField {
    registration?: UseFormRegisterReturn;
    error?: string;
}

export type RecruitFieldName = "title" | "capacity" | "startAt" | "endAt" | "description";

export interface NewRecruitFormProps {
    // 경로 조립을 부모에게 맡겨야 이벤트 폼의 recruit.startAt과 모집 단독 폼의 startAt에 같이 쓸 수 있다.
    /** 필드 이름을 부모 폼의 경로로 바꿔 registration·error를 돌려준다 */
    bind: (name: RecruitFieldName) => RecruitField;
    /** 정원 바로 아래에 끼울 안내. 수정 화면이 정원 축소 경고를 여기에 붙인다. */
    capacityNotice?: ReactNode;
    className?: string;
}

/** 이벤트 폼 안에 들어가야 해서 form이 아니라 필드 묶음만 그린다. 제출은 감싸는 폼이 맡는다. */
export function NewRecruitForm({ bind, capacityNotice, className }: NewRecruitFormProps) {
    return (
        <div className={className}>
            <GetInputArea type="text" title="회차 이름" description="비우면 '모집'으로 보여요" {...bind("title")}/>
            <GetInputArea type="number" title="정원" description="이번 회차에서 받을 최대 인원. 비우면 제한 없이 받아요" positiveOnly {...bind("capacity")}/>
            {capacityNotice}
            <GetInputArea type="datetime" title="모집 시작 기간" description="모집 시작 기간을 입력하시오" width="w-100" {...bind("startAt")}/>
            <GetInputArea type="datetime" title="모집 종료 기간" description="모집 종료 기간을 입력하시오" width="w-100" {...bind("endAt")}/>
            <GetInputArea type="textarea" title="모집 유의사항" description="모집 유의사항은 신청시 모달 형식으로 나옵니다." isLong {...bind("description")}/>
        </div>
    )
}
