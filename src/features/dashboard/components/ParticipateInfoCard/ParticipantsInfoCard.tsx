import { cn } from "@/lib/cn";
import { participateContentStatus, participateStatusClasses } from "@/types/status";
import AuthorAvatar from "@/components/ui/AuthorAvatar/AuthorAvatar";
import Color from "color";
import Image from "next/image";


const MAX_NAME_LENGTH = 16

export interface ParticipateStatusProps {
  id:string
  name: string;
  primaryColor:string;
  secondaryColor:string;
  isTrue:boolean
}

export interface ParticipantsInfoCardProps {
  username: string;
  userStatus: ParticipateStatusProps[];
}


export default function ParticipantInfoCard({
  username,
  userStatus
}: ParticipantsInfoCardProps) {



  return (
    <div className="flex justify-center">
      <div
        className={cn(
          // mobile
          "flex w-full max-w-sm items-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100",

          // desktop
          "sm:w-auto sm:flex-col sm:items-center sm:gap-2 sm:px-2 sm:py-4 sm:text-center"
        )}
      >
        <AuthorAvatar
          imageUrl={`https://picsum.photos/seed/${username}/300/200`}  
          description={username}
          size={12}
          style="size-12 sm:mx-5 sm:size-15"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:items-center">
          <span className="truncate text-left sm:text-center sm:min-h-12 min-w-0 break-all whitespace-pre-wrap" title={username.length >= MAX_NAME_LENGTH+1 ? username : undefined}>
            {username.slice(0, MAX_NAME_LENGTH)}{username.length >= MAX_NAME_LENGTH+1 && "..."}
          </span>
  

          <div
            className={cn(
              // mobile
              "flex flex-wrap gap-x-3 gap-y-1",

              // desktop 2열 grid
              "sm:grid sm:grid-cols-2 sm:gap-y-2 sm:w-20"
            )}
          >
            {userStatus.map((status) => (
              <span
                key={status.id}
                className={cn(
                  "text-[13px] font-bold",
                  !status.isTrue && "text-zinc-300 dark:text-zinc-600",
                  "sm:odd:justify-self-start sm:even:justify-self-end"
                )}
                style={status.isTrue ? { color: status.primaryColor } : undefined}
              >
                {status.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

//TODO: status 갈아업기
//DONE: 1. ParticipantsInfo쪽
//DONE: 2. InfoCardsContainer쪽
//DONE: 3. Page 수정
//TODO: 3.1.my Page 수정
//TODO: 4. 쓸데없는 type/status같은거 없애기