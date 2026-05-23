import { ClassNameValue } from "tailwind-merge";



interface ObjectStatusWithCalsses {
  [key: string]: ClassNameValue;
}

export const dashboardStatusClasses = {
  예정: "text-cyan-600 dark:text-cyan-300",
  체크안됨: "text-amber-600 dark:text-amber-300",
  체크됨: "text-sky-600 dark:text-sky-300",
  완료: "text-emerald-600 dark:text-emerald-300",
} as const satisfies ObjectStatusWithCalsses;

/// type participateContentStatus = "예정" | "체크안됨" | "체크됨" | "완료" | ...
export type dashboardStatusTypes = keyof typeof dashboardStatusClasses | (string & {});

export const participateStatusClasses = {
  입금: "text-teal-600 dark:text-teal-300",
  도착: "text-orange-600 dark:text-orange-300",
  귀가: "text-purple-600 dark:text-purple-300",
  뒤풀이: "text-pink-600 dark:text-pink-300",
} as const satisfies ObjectStatusWithCalsses;


export type participateContentStatus = keyof typeof participateStatusClasses | (string & {});