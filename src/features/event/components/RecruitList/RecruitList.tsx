"use client";
import { Gauge } from "@/components/ui/Gauge/Gauge";
import { GetInputArea } from "@/components/ui/GetInput/GetInput";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";
import type { RecruitStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import { daysUntil, formatShortPeriod } from "@/lib/date";
import { RecruitFormValues, recruitSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { NewRecruitForm, RecruitFieldName } from "../NewRecruitForm/NewRecruitForm";
import { useMutation } from "@tanstack/react-query";

/** status(관리자가 연·닫은 상태)와 기간을 합쳐 화면에 보일 단계를 정한다. */
export type RecruitPhase = "예정" | "모집중" | "마감";

export function deriveRecruitPhase(
    status: RecruitStatus,
    startAt?: Date | null,
    endAt?: Date | null,
    now: Date = new Date(),
): RecruitPhase {
    if (status === "CLOSED") return "마감";
    if (endAt && now.getTime() > endAt.getTime()) return "마감";
    if (startAt && now.getTime() < startAt.getTime()) return "예정";
    return "모집중";
}

export interface Recruit {
    id: string;
    status: RecruitStatus;
    title?: string | null;
    description?: string | null;
    startAt?: Date | null;
    endAt?: Date | null;
    userCount: number;
    userMaxCount?: number | null;
}

interface RecruitCardProps extends Recruit {
    groupId: string;
    /** 넘기면 명단 버튼이 나온다. 신청자 화면이 준비되면 연결한다. */
    onShowApplicants?: (recruitId: string) => void;
}

/** 레일이 좁아도 손가락이 닿아야 해서 높이는 44px로 잡는다. */
const BUTTON_CLASS =
    "flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border border-zinc-300 " +
    "text-[12px] font-semibold transition-colors hover:bg-zinc-50 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 " +
    "disabled:cursor-not-allowed disabled:text-zinc-400 dark:disabled:text-zinc-500 " +
    "dark:border-zinc-700 dark:hover:bg-zinc-800/50";

/** 관리자용 모집 카드. 지금 얼마나 모였는지와 계속 받을지를 다룬다. */
function RecruitCard({
    id,
    groupId,
    status,
    title,
    startAt,
    endAt,
    userCount,
    userMaxCount,
    onShowApplicants,
}: RecruitCardProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const phase = deriveRecruitPhase(status, startAt, endAt);
    const isClosed = phase === "마감";
    const isUpcoming = phase === "예정";

    const capacity = userMaxCount ?? null;
    const isFull = capacity !== null && userCount >= capacity;
    // 마지막 몇 자리는 관리자가 정원을 늘릴지 마감할지 정해야 하는 구간이다
    const isNearFull = capacity !== null && !isFull && userCount / capacity >= 0.9;

    // 마감된 회차는 제목 색을 낮춰 물러나게 한다. opacity로 흐리면 배경과 섞여
    // 카드 안 모든 글자의 대비가 함께 깎이고 버튼까지 비활성처럼 보인다.
    const tone = isClosed
        ? {
              dot: "bg-zinc-400 dark:bg-zinc-600",
              title: "text-zinc-500 dark:text-zinc-400",
              count: "text-zinc-500 dark:text-zinc-400",
              fill: "var(--color-zinc-400)",
          }
        : isFull
          ? {
                dot: "bg-rose-500",
                title: "",
                count: "text-rose-600 dark:text-rose-400",
                fill: "var(--color-rose-600)",
            }
          : isNearFull
            ? {
                  dot: "bg-amber-500",
                  title: "",
                  count: "text-amber-600 dark:text-amber-400",
                  fill: "var(--color-amber-500)",
              }
            : isUpcoming
              ? { dot: "bg-amber-500", title: "", count: "", fill: "var(--color-amber-500)" }
              : { dot: "bg-emerald-500", title: "", count: "", fill: "var(--color-emerald-500)" };

    // 시작 전에는 마감일이 아직 먼 이야기라 시작일을 센다
    const countdown = (() => {
        if (isClosed) return "마감됨";
        if (isUpcoming) {
            if (!startAt) return null;
            const days = daysUntil(startAt);
            return days > 0 ? `${days}일 뒤 시작` : "오늘 시작";
        }
        if (!endAt) return null;
        const days = daysUntil(endAt);
        return days > 0 ? `${days}일 남음` : "오늘 마감";
    })();

    // 정원이 코앞이면 날짜보다 남은 자리가 더 급한 정보다.
    // 이미 마감한 회차는 되레 언제 진행했는지를 봐야 한다.
    const highlight = isClosed
        ? null
        : isFull
          ? "정원 마감"
          : isNearFull
            ? `${capacity! - userCount}자리 남음`
            : null;

    const handleToggle = async () => {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch(`/api/v1/group/${groupId}/event/recruit/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status === "OPEN" ? "CLOSED" : "OPEN" }),
        }).catch(() => null);
        setIsSubmitting(false);

        // 이 페이지는 멤버도 볼 수 있지만 API는 관리자만 통과시킨다.
        // 눌렀는데 아무 일도 안 일어나면 고장인지 권한인지 알 수 없다.
        if (!response) {
            setError("연결에 실패했어요. 잠시 뒤 다시 시도해주세요");
            return;
        }
        if (!response.ok) {
            setError(response.status === 403 ? "모집을 바꿀 권한이 없어요" : "바꾸지 못했어요. 다시 시도해주세요");
            return;
        }
        router.refresh();
    };

    return (
        <article
            className={cn(
                "rounded-xl border border-zinc-200 p-3 dark:border-zinc-800",
                isClosed ? "bg-zinc-50 dark:bg-zinc-900/20" : "bg-white dark:bg-zinc-900/40",
            )}
        >
            <div className="flex items-center gap-2">
                <span aria-hidden className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
                <h3 className={cn("min-w-0 flex-1 truncate text-[13px] font-semibold", tone.title)}>
                    {title || "모집"}
                </h3>
                <span className="shrink-0 text-[11px] text-zinc-500 dark:text-zinc-400">{phase}</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className={cn("text-[22px] leading-none font-bold tabular-nums", tone.count)}>
                    {userCount}
                </span>
                <span className="text-[12px] text-zinc-500 dark:text-zinc-400">
                    {capacity !== null ? `/ ${capacity}명 신청` : "명 신청"}
                </span>
            </div>

            {/* 정원이 없으면 채움 기준이 없고, 시작 전이면 늘 0이라 빈 막대만 남는다 */}
            {capacity !== null && !isUpcoming && (
                <Gauge
                    value={userCount}
                    max={capacity}
                    color={tone.fill}
                    className="mt-1.5 h-1 dark:bg-zinc-800"
                    ariaLabel={`${title || "모집"} 정원 대비 신청 인원`}
                />
            )}

            <p
                className={cn(
                    "mt-2 text-[11px] text-zinc-500 dark:text-zinc-400",
                    highlight && !isClosed && "font-semibold text-amber-600 dark:text-amber-400",
                    isFull && !isClosed && "text-rose-600 dark:text-rose-400",
                )}
            >
                {highlight ?? [formatShortPeriod(startAt, endAt), countdown].filter(Boolean).join(" · ")}
            </p>

            <div className="mt-2.5 flex gap-1.5">
                {onShowApplicants && (
                    <button
                        type="button"
                        onClick={() => onShowApplicants(id)}
                        className={cn(BUTTON_CLASS, "text-zinc-700 dark:text-zinc-200")}
                    >
                        명단
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className={cn(BUTTON_CLASS, "text-zinc-600 dark:text-zinc-300")}
                >
                    {isSubmitting ? "바꾸는 중…" : status === "OPEN" ? "마감" : "다시 열기"}
                </button>
            </div>

            {error && (
                // role="alert"이라야 스크린리더가 실패를 즉시 읽어준다
                <p role="alert" className="mt-1.5 text-[11px] text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </article>
    );
}

export interface RecruitListProps {
    recruits: Recruit[];
    groupId: string;
    /** 회차를 여는 대상 이벤트. 모집은 이벤트에 붙으므로 목록만으로는 알 수 없다. */
    eventId: string;
    /** 넘기면 카드에 명단 버튼이 나온다. 신청자 화면이 준비되면 연결한다. */
    onShowApplicants?: (recruitId: string) => void;
}

export function RecruitList({ recruits, groupId, eventId, onShowApplicants }: RecruitListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        // 옆 레일에 놓이므로 제목 크기를 EventAbout에 맞춘다
        <section>
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">모집</h2>
                <button
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                    className="flex cursor-pointer items-center gap-0.5 rounded-sm py-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-100"
                >
                    <Plus size={12} strokeWidth={2.5} />
                    회차 추가
                </button>
            </div>

            {recruits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 py-6 text-center text-[12px] text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                    아직 모집이 없어요
                </div>
            ) : (
                <ul className="flex flex-col gap-1.5">
                    {recruits.map((recruit) => (
                        <li key={recruit.id}>
                            <RecruitCard {...recruit} groupId={groupId} onShowApplicants={onShowApplicants} />
                        </li>
                    ))}
                </ul>
            )}
            {isAddOpen && (
                <AddRecruitModal groupId={groupId} eventId={eventId} onClose={() => setIsAddOpen(false)} />
            )}
        </section>
    );
}



export function AddRecruitModal({
    groupId,
    eventId,
    onClose,
}: {
    groupId: string;
    eventId: string;
    onClose: () => void;
}) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RecruitFormValues>({
        mode: "onChange",
        resolver: zodResolver(recruitSchema),
    });

    const bind = (name: RecruitFieldName) => ({
        registration: register(name),
        error: errors[name]?.message,
    });

    // 정원은 preprocess를 거쳐 입력 타입이 느슨하다. 미리보기에 쓸 수 있게 숫자로 좁힌다.
    const typedCapacity = Number(useWatch({ control, name: "capacity" }) as string | number | undefined);
    const capacity = Number.isFinite(typedCapacity) && typedCapacity > 0 ? typedCapacity : null;

    const openRecruit = useMutation({
        mutationFn: async (data: RecruitFormValues) => {
            const response = await fetch(`/api/v1/group/${groupId}/event/${eventId}/recruit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(response.status === 403 ? "모집을 열 권한이 없어요" : "모집을 열지 못했어요");
            }
            return response.json();
        },
        onSuccess: () => {
            onClose();
            router.refresh();
        },
    });

    return (
        <Modal isOpen onClose={onClose} aria-label="새 모집 회차">
            {/* GetInputArea가 입력에 w-80을 고정으로 잡아, 이보다 좁으면 라벨 칸이 눌린다 */}
            <ModalContent className="max-h-[85vh] w-[min(92vw,680px)] overflow-y-auto">
                <form onSubmit={handleSubmit((data) => openRecruit.mutate(data))}>
                    <div className="px-4 pt-1">
                        <h2 className="text-xl font-bold tracking-tight">새 모집 회차</h2>
                        <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                            정원과 기간을 정하면 참가 신청을 받기 시작해요.
                        </p>
                    </div>

                    {/* 카드와 같은 어휘로 만들 회차를 미리 보여준다. 정원을 치면 여기가 즉시 따라온다. */}
                    <div className="mt-5 border-y border-zinc-200 px-4 py-5 dark:border-zinc-800">
                        <div className="flex items-baseline gap-2">
                            <span className="text-[44px] leading-none font-bold tabular-nums">0</span>
                            <span className="text-[15px] text-zinc-500 dark:text-zinc-400">
                                {capacity ? `/ ${capacity}명 신청` : "명 신청"}
                            </span>
                        </div>

                        {/* 게이지는 생성 시점에 늘 0%라 빈 막대만 남는다. 숫자와 말이 대신한다. */}
                        <p className="mt-2.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                            {capacity
                                ? `${capacity}자리로 시작해서, 다 차면 카드가 정원 마감으로 바뀌어요`
                                : "정원을 비우면 인원 제한 없이 받습니다"}
                        </p>
                    </div>

                    <GetInputArea
                        type="text"
                        title="회차 이름"
                        description="비우면 '모집'으로 보여요"
                        registration={register("title")}
                        error={errors.title?.message}
                    />
                    <GetInputArea
                        type="number"
                        title="정원"
                        description="이번 회차에서 받을 최대 인원"
                        positiveOnly
                        registration={register("capacity")}
                        error={errors.capacity?.message}
                    />
                    <NewRecruitForm bind={bind} />

                    {/* 폼이 길어 스크롤되므로, 확정 버튼은 늘 손 닿는 곳에 붙여둔다 */}
                    <div className="sticky bottom-0 -mx-5 -mb-5 mt-4 border-t border-zinc-200 bg-zinc-100 px-9 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <button
                            type="submit"
                            disabled={openRecruit.isPending}
                            className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-zinc-900 text-[15px] font-bold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:disabled:bg-zinc-600"
                        >
                            {openRecruit.isPending ? "여는 중…" : "모집 열기"}
                        </button>

                        {openRecruit.isError && (
                            <p role="alert" className="mt-2 text-center text-[12px] text-red-600 dark:text-red-400">
                                {openRecruit.error instanceof Error ? openRecruit.error.message : "모집을 열지 못했어요"}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 min-h-9 w-full cursor-pointer rounded-lg text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-100"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </ModalContent>
        </Modal>
    );
}
