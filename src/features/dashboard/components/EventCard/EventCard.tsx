


import { Gauge } from "@/components/ui/Gauge/Gauge";
import { cn } from "@/lib/cn";
import { formatDate, formatTime } from "@/lib/date";
import { CalendarDays, Clock, Users } from "lucide-react";

export type StatusType = "모집중" | "진행중" | "종료됨";



interface EventCardProps {
    title:string;
    description:string;
    status:StatusType;
    primaryColor:string;
    secondaryColor:string;

    memberCount:number
    minMemberCount?:number
    maxMemberCount?:number
    dateTitle:string;
    date:Date
}


const colorOfStatus:Record<StatusType, {textColor:string, bgColor:string}> = {
    "모집중":{
        textColor:"#0F9D63",
        bgColor:"#e6f6ee"
    },
    "진행중":{
        textColor:"#2563eb",
        bgColor:"#e9f1fe"
    },
    "종료됨":{
        textColor:"#6B7280",
        bgColor:"#f3f4f6"
    },
}

interface EventGageProps {
    current: number;
    min?: number;
    max?: number;
}

//status가 "모집중"일때 게이지바
export function MemberCountGauge({ current, min, max }: EventGageProps) {

    if (min && max){ //최대 최소 둘 다 있을때
        const reached:boolean = current > min
        const over:boolean = current >= max
        return (
            <div className="flex flex-col gap-1.5 ">
                <div className="flex justify-between text-[13px] font-bold">
                    <span className="text-zinc-400">
                        <span className={reached ? "text-green-800":""}>최소 {min}명</span> · <span className={over ? "text-red-700":""}>최대 {max}명</span></span>
                    <span className={cn("text-zinc-400", reached && "text-green-800", over &&"text-red-700")}>
                        {current}/{max}명{reached && " · 최소 달성"}
                    </span>
                </div>
                <Gauge
                    value={current}
                    max={max}
                    {...(reached && (over ? {color:"#c13c35"}:{color:"#016630"}))}
                    markers={[{ value: min, label: `최소 모집인원 ${min}명` }]}
                    ariaLabel="정원 대비 현재 인원"
                />
            </div>
        );
    }
    else if (min) {
        const reached:boolean = current > min
        return (
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px] font-bold">
                    <span className="text-zinc-400">
                        <span className={reached ? "text-green-800":""}>최소 모집인원 {min}명</span></span>
                    <span className={cn("text-zinc-400", reached && "text-green-800")}>
                        {current}명{reached && " · 최소 달성"}
                    </span>
                </div>
                <Gauge
                    value={current}
                    max={min}
                    {...(reached && {color:"#016630"})}
                    ariaLabel="정원 대비 현재 인원"
                />
            </div>
        );
    }
    else if (max){
        const over:boolean = current >= max
        return (
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13px] font-bold">
                    <span className="text-zinc-400">
                        <span className={over ? "text-red-700":""}>최대 {max}명</span></span>
                    <span className={cn("text-zinc-400", over &&"text-red-700")}>
                        {current}/{max}명
                    </span>
                </div>
                <Gauge
                    value={current}
                    max={max}
                    {...(over ? {color:"#c13c35"}:{color:"#016630"})}
                    ariaLabel="정원 대비 현재 인원"
                />
            </div>
        );
    }
    else {
        return(<></>)
    }
}


export function EventCard({
    title,
    description,
    status,
    primaryColor,
    secondaryColor,
    memberCount,
    minMemberCount,
    maxMemberCount,
    date,
}: EventCardProps) {
    return (
        <article className="border border-zinc-300 rounded-2xl overflow-hidden transition duration-300 hover:scale-105">
            <div className="h-2" style={{backgroundColor:primaryColor}}/>
            <div className="pt-4.5 px-5 pb-4">
                <div className="flex justify-between items-start">
                    {/* min-w-0이 없으면 flex 아이템이 내용보다 작아지지 않아서 긴 설명이 배지를 밀어낸다 */}
                    <div className="flex flex-row gap-2 min-w-0 flex-1">
                        <div className="rounded-lg w-12 h-12 shrink-0" style={{backgroundColor:secondaryColor}}>
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-lg">{title}</h2>
                            <p className="text-[13px] line-clamp-2">{description}</p>
                        </div>
                    </div>
                    <div className="rounded-3xl px-2 py-1 text-xs shrink-0 whitespace-nowrap" style={{backgroundColor:colorOfStatus[status]?.bgColor || "#a8a8a8", color:colorOfStatus[status]?.textColor || "#6d6d6d"}}>
                        {status}
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 my-4 text-[13px] font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
                        {formatDate(date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {formatTime(date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        {memberCount}명 참여
                    </span>
                </div>
                <MemberCountGauge current={memberCount} min={minMemberCount} max={maxMemberCount} />
            </div>
        </article>
    )
}