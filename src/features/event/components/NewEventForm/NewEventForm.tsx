"use client"

import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { eventSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";



export function NewEventForm () {
    const {
        register, 
        handleSubmit,
        formState:{errors}} = useForm({
        resolver:zodResolver(eventSchema),
        mode:"onChange",

    })
    return(
        <form>
            <GetInputArea type="text" title="이벤트 이름" description="이벤트 이름을 입력하시오" required registration={register("name")}/>
            <GetInputArea type="textarea" title="이벤트 설명" description="이벤트 설명을 입력하시오" isLong registration={register("description")}/>
            <GetInputArea type="datetime" title="이벤트 시작시간" description="이벤트 시작 기간을 입력하시오" registration={register("startAt")}/>
            <GetInputArea type="datetime" title="이벤트 종료시간" description="이벤트 종료 기간을 입력하시오" registration={register("endAt")}/>
            <GetInputArea type="number" title="최소 인원" description="최소인원을 설정할 수 있어요!" registration={register("minMember")}/>
            <GetInputArea type="datetime" title="이벤트 종료시간" description="이벤트 종료 기간을 입력하시오" registration={register("endAt")}/>
        </form>
    )
}