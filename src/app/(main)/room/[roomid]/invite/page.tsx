"use client";

import React from "react";
import { Clipboard, Send } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useNavigate } from "storybook/internal/router";

export default function RoomInvite() {
    const { roomid } = useParams<{ roomid: string }>();
    const searchParams = useSearchParams();

    const inviteType = searchParams.get("type");

    const [inviteURL, setInviteURL] = useState("")
    const [isCopied, setisCopied] = useState<boolean>(false)
    const router = useRouter();


    useEffect(() => {
        const handleVisibilityChange = () => {
            document.visibilityState === "hidden" && setisCopied(false)
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return(()=>document.removeEventListener("visibilitychange", handleVisibilityChange))
    }, [])

    useEffect(() => {
        setInviteURL(`${window.location.origin}/room/${roomid}/invite`) //TODO: 바꿔야함
    }, [roomid])


    const handleClickClipboard = () => {
        navigator.clipboard.writeText(inviteURL)
        setisCopied(true)
    }


    //TODO: 초대 관련 api 만들고 이거 하기
    const handleClickButton = (e: React.MouseEvent<HTMLDivElement>) => {
        if (inviteType === "new") {
            router.push(`/room/${roomid}/dashboard`)
        }
        else if (!inviteType) {
            //초대받은거일때, join api 호출
        }
    }

    return(
        <div className="fixed flex items-center justify-center inset-0 z-50 bg-slate-950">
            <div className="flex flex-col items-center bg-zinc-700 p-10 rounded-2xl min-w-105">
                <div>
                    <h1 className="text-zinc-200 text-2xl font-extrabold">
                        {inviteType == "new" ? "🎉 방을 만들었습니다!" : 
                         !inviteType && "방에 초대되었습니다!" }
                    </h1>
                </div>
                <div className="mt-5">
                    { inviteType === "new" ?
                        (<p className="text-center text-zinc-300">
                            방을 만들었습니다!<br/>
                            아래 <span className="text-emerald-300 underline cursor-pointer" onClick={handleClickClipboard}>링크</span>를 복사해 사람들을 당신의 방에 초대하세요! 
                        </p>):
                        (<p className="text-center text-zinc-300">
                            <span className="text-lime-600">[방 이름]</span>으로부터 초대되었습니다! <br/>
                            현재 이 방엔 <span className="text-purple-400">[사람수]</span>명의 멤버들이 있습니다.
                        </p>)
                    }
                </div>
                <div className="mt-5">
                    {isCopied ? 
                    <h6 className="text-center text-green-400 text-[12px] font-bold"> 복사됨 </h6> :
                    <h6 className="text-center text-zinc-500 text-[12px] font-bold"> 초대코드 </h6> }
                    <div className="relative border-2 border-zinc-600 rounded w-70 px-4 py-2 mt-1">
                        <div className="overflow-x-scroll
                            mask-[linear-gradient(to_right,black_50%,transparent_95%)]
                            [-webkit-mask-image:linear-gradient(to_right,black_50%,transparent_95%)]
                            [&::-webkit-scrollbar]:h-0.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-zinc-500">
                                <div className="inline-flex items-center">
                                    <span className="text-zinc-400 text-xl text-center">
                                        {inviteURL}
                                    </span>
                                    <span className="w-10 shrink-0 inline-block"></span>
                                </div>
                        </div>
                        <div className="absolute right-1 bottom-0 h-full flex items-center">
                            <button className="cursor-pointer" onClick={handleClickClipboard}>
                                <Clipboard color="#f0f0f0"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="group flex justify-center items-center gap-2 bg-green-600 w-full mt-5 rounded-2xl py-2 overflow-hidden text-green-900 text-[20px] font-extrabold cursor-pointer duration-300 hover:scale-102 hover:text-green-800" onClick={handleClickButton}>
                    <div className="duration-300 delay-400 group-hover:delay-0 group-hover:-rotate-130">
                        <div className="duration-400 group-hover:delay-300 group-hover:rotate-25">
                            <Send className="duration-400 group-hover:delay-300 group-hover:translate-x-25 group-hover:-translate-y-25 group-hover:ease-in"/>
                        </div>
                    </div>
                    {inviteType === "new" ? "이동하기" : "참여하기"}
                </div>
            </div>
        </div>
    )
}