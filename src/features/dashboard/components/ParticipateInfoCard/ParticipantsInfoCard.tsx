import { cn } from "@/lib/cn";
import { participateContentStatus, participateStatusClasses } from "@/types/status";
import { User } from "lucide-react";

export interface ParticipantsInfoCardProps {
    username: string;
    allStatus: (participateContentStatus | string)[];
    enableStatus: participateContentStatus[];
}

const notIncludeStatusClasses = "text-gray-300 dark:text-gray-600";
const includedStatusFallbackClasses = "text-gray-600 dark:text-gray-200";

export default function ParticipantInfoCard({
  username,
  enableStatus,
  allStatus,
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
        <div
          className={cn(
            // mobile
            "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300",

            // desktop
            "sm:mx-5 sm:size-15"
          )}
        >
          <User className="size-7 sm:size-8" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:items-center">
          <span className="truncate text-left sm:text-center">
            {username}
          </span>

          <div
            className={cn(
              // mobile
              "flex flex-wrap gap-x-3 gap-y-1",

              // desktop 2열 grid
              "sm:grid sm:w-full sm:grid-cols-2 sm:gap-y-2"
            )}
          >
            {allStatus.map((status, index) => {
              const isEnabled = enableStatus.includes(
                status as participateContentStatus
              );

              const statusClass =
                participateStatusClasses[
                  status as keyof typeof participateStatusClasses
                ] ?? includedStatusFallbackClasses;

              return (
                <span
                  key={status + index.toString()}
                  className={cn(
                    "text-[13px] font-bold",
                    isEnabled && statusClass,
                    !isEnabled && notIncludeStatusClasses,

                    // desktop에서 좌우 정렬
                    "sm:odd:justify-self-start sm:even:justify-self-end"
                  )}
                >
                  {status}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}