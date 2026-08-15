"use client";
import { Gauge } from "@/components/ui/Gauge/Gauge";
import { Modal, ModalContent } from "@/components/ui/Modal/Modal";
import { cn } from "@/lib/cn";
import { daysUntil, formatShortDateTime, formatShortPeriod } from "@/lib/date";
import { RecruitFormValues, recruitSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { deriveRecruitPhase, type Recruit } from "../../lib/recruit";
import { NewRecruitForm, RecruitFieldName } from "../NewRecruitForm/NewRecruitForm";

/** API가 돌려주는 신청 한 건. 날짜는 JSON을 건너오며 문자열이 된다. */
interface Applicant {
    id: string;
    status: "APPLIED" | "CANCELED";
    appliedAt: string;
    member: { nickname: string | null; user: { name: string | null } };
}

/** PATCH가 돌려주는 Prisma Recruit. 화면 모델과 이름이 달라 여기서 맞춘다. */
interface SavedRecruit {
    title: string | null;
    notice: string | null;
    capacity: number | null;
    startAt: string | null;
    endAt: string | null;
}

/** 처음에는 이만큼만 보여준다. 정원이 큰 회차에서 모달이 끝없이 길어지지 않게. */
const VISIBLE_APPLICANTS = 6;

const PHASE_STYLE = {
    예정: { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300" },
    모집중: {
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    },
    마감: { dot: "bg-zinc-400 dark:bg-zinc-600", badge: "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
} as const;

// 모달 표면이 zinc-100이라 zinc-500은 4.39:1로 AA에 못 미친다. 한 단계 진하게 잡는다.
const MUTED = "text-zinc-600 dark:text-zinc-400";

const ACTION_CLASS =
    "flex min-h-9 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 " +
    "text-[13px] font-semibold transition-colors hover:bg-zinc-50 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 " +
    "disabled:cursor-not-allowed disabled:text-zinc-400 dark:disabled:text-zinc-500 " +
    "dark:border-zinc-700 dark:hover:bg-zinc-800/50";

export function RecruitDetailModal({
    recruit,
    groupId,
    onClose,
    onRecruitChange,
}: {
    recruit: Recruit;
    groupId: string;
    onClose: () => void;
    /** 저장·마감 결과를 목록으로 올려 카드와 모달이 어긋나지 않게 한다 */
    onRecruitChange: (recruit: Recruit) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [savedAt, setSavedAt] = useState<number | null>(null);

    const phase = deriveRecruitPhase(recruit.status, recruit.startAt, recruit.endAt);
    const title = recruit.title || "모집";

    return (
        // 모드가 바뀌면 라벨도 바뀌어야 한다. 안 그러면 편집 중에도 "상세"라고 읽어준다.
        <Modal
            isOpen
            onClose={onClose}
            aria-label={isEditing ? `${title} 수정` : `${title} 상세`}
            closeOnOverlayClick={!isEditing}
            closeOnEsc={!isEditing}
        >
            <ModalContent className="max-h-[85vh] w-[min(92vw,980px)] overflow-y-auto">
                {isEditing ? (
                    <RecruitEditForm
                        recruit={recruit}
                        groupId={groupId}
                        onSaved={(updated) => {
                            onRecruitChange(updated);
                            setSavedAt(Date.now());
                            setIsEditing(false);
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <RecruitOverview
                        recruit={recruit}
                        groupId={groupId}
                        phase={phase}
                        savedAt={savedAt}
                        onEdit={() => {
                            setSavedAt(null);
                            setIsEditing(true);
                        }}
                        onRecruitChange={onRecruitChange}
                    />
                )}
            </ModalContent>
        </Modal>
    );
}

function RecruitOverview({
    recruit,
    groupId,
    phase,
    savedAt,
    onEdit,
    onRecruitChange,
}: {
    recruit: Recruit;
    groupId: string;
    phase: keyof typeof PHASE_STYLE;
    savedAt: number | null;
    onEdit: () => void;
    onRecruitChange: (recruit: Recruit) => void;
}) {
    const router = useRouter();
    const [showAll, setShowAll] = useState(false);
    const tone = PHASE_STYLE[phase];

    const {
        data: applicants,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery<Applicant[]>({
        queryKey: ["recruitApplicants", groupId, recruit.id],
        queryFn: async () => {
            const response = await fetch(`/api/v1/group/${groupId}/event/recruit/${recruit.id}/applicants`).catch(
                () => null,
            );
            if (!response) throw new Error("연결에 실패했어요");
            if (!response.ok) {
                throw new Error(response.status === 403 ? "명단을 볼 권한이 없어요" : "명단을 불러오지 못했어요");
            }
            return response.json();
        },
    });

    const toggleStatus = useMutation({
        mutationFn: async () => {
            const nextStatus = recruit.status === "OPEN" ? "CLOSED" : "OPEN";
            const response = await fetch(`/api/v1/group/${groupId}/event/recruit/${recruit.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            }).catch(() => null);

            if (!response) throw new Error("연결에 실패했어요. 잠시 뒤 다시 시도해주세요");
            if (!response.ok) {
                throw new Error(response.status === 403 ? "모집을 바꿀 권한이 없어요" : "바꾸지 못했어요");
            }
            return nextStatus as Recruit["status"];
        },
        // 명단을 읽던 중이었을 수 있으니 닫지 않고 그 자리에서 상태만 바꾼다
        onSuccess: (nextStatus) => {
            onRecruitChange({ ...recruit, status: nextStatus });
            router.refresh();
        },
    });

    // 신청 수는 목록 조회가 아니라 넘겨받은 값에서 읽는다.
    // 조회에서 파생하면 로딩 중과 실패 후에 "0명"이라고 단언하게 된다.
    const capacity = recruit.userMaxCount ?? null;
    const canceledCount = applicants?.filter((applicant) => applicant.status === "CANCELED").length ?? 0;

    // 취소자가 미리보기 자리를 먹지 않도록 신청자를 앞에 세운다
    const ordered = applicants
        ? [...applicants].sort((a, b) => Number(a.status === "CANCELED") - Number(b.status === "CANCELED"))
        : [];
    const visible = showAll ? ordered : ordered.slice(0, VISIBLE_APPLICANTS);
    const hiddenCount = ordered.length - VISIBLE_APPLICANTS;

    return (
        <div className="px-1">
            <div className="flex items-center gap-2">
                <span aria-hidden className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
                <h2 className="min-w-0 flex-1 truncate text-[17px] font-bold">{recruit.title || "모집"}</h2>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", tone.badge)}>
                    {phase}
                </span>
            </div>
            <p className={cn("mt-1 text-[12px]", MUTED)}>
                {[
                    formatShortPeriod(recruit.startAt, recruit.endAt),
                    phase === "모집중" && recruit.endAt && `${daysUntil(recruit.endAt)}일 남음`,
                ]
                    .filter(Boolean)
                    .join(" · ")}
            </p>

            {savedAt !== null && (
                <p
                    role="status"
                    className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 dark:text-emerald-400"
                >
                    <Check size={14} strokeWidth={3} />
                    저장했어요
                </p>
            )}

            <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] leading-none font-bold tabular-nums">{recruit.userCount}</span>
                    <span className={cn("text-[13px]", MUTED)}>
                        {capacity !== null ? `/ ${capacity}명 신청` : "명 신청"}
                    </span>
                </div>
                {capacity !== null && (
                    <Gauge
                        value={recruit.userCount}
                        max={capacity}
                        color="var(--color-emerald-500)"
                        className="mt-2.5 h-1.5 dark:bg-zinc-800"
                        ariaLabel={`${recruit.title || "모집"} 정원 대비 신청 인원`}
                    />
                )}
            </div>

            {recruit.description && (
                <div className="mt-4 rounded-lg bg-zinc-200/60 p-3 dark:bg-zinc-800/50">
                    <p className={cn("text-[11px] font-semibold", MUTED)}>유의사항</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                        {recruit.description}
                    </p>
                </div>
            )}

            <p className={cn("mt-5 text-[11px] font-semibold tracking-wide", MUTED)}>
                신청자 {recruit.userCount}명
                {canceledCount > 0 && ` · 취소 ${canceledCount}명`}
            </p>

            {isLoading ? (
                <p className={cn("py-6 text-center text-[12px]", MUTED)}>불러오는 중…</p>
            ) : isError ? (
                <div className="mt-1 rounded-lg border border-dashed border-zinc-300 py-5 text-center dark:border-zinc-700">
                    <p role="alert" className="text-[12px] text-red-600 dark:text-red-400">
                        명단을 불러오지 못했어요
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="mt-2 min-h-9 cursor-pointer rounded-lg border border-zinc-300 px-4 text-[12px] font-semibold transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-800/50 dark:focus-visible:ring-zinc-100"
                    >
                        {isFetching ? "다시 부르는 중…" : "다시 시도"}
                    </button>
                </div>
            ) : ordered.length > 0 ? (
                <ul className="mt-1">
                    {visible.map((applicant) => {
                        const isCanceled = applicant.status === "CANCELED";
                        return (
                            <li
                                key={applicant.id}
                                className="flex items-center gap-2.5 border-b border-zinc-200 py-2.5 dark:border-zinc-800"
                            >
                                <span
                                    className={cn(
                                        "min-w-0 flex-1 truncate text-[13px] font-semibold",
                                        isCanceled && cn("font-normal line-through", MUTED),
                                    )}
                                >
                                    {applicant.member.nickname || applicant.member.user.name || "이름 없음"}
                                </span>
                                {isCanceled && (
                                    <span
                                        className={cn(
                                            "shrink-0 rounded-full border border-zinc-300 px-2 py-0.5 text-[11px] dark:border-zinc-700",
                                            MUTED,
                                        )}
                                    >
                                        취소
                                    </span>
                                )}
                                <span className={cn("shrink-0 text-[12px] tabular-nums", MUTED)}>
                                    {formatShortDateTime(new Date(applicant.appliedAt))}
                                </span>
                            </li>
                        );
                    })}

                    {!showAll && hiddenCount > 0 && (
                        <li>
                            <button
                                type="button"
                                onClick={() => setShowAll(true)}
                                className={cn(
                                    "min-h-10 w-full cursor-pointer text-[12px] transition-colors hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100",
                                    MUTED,
                                )}
                            >
                                {hiddenCount}명 더 보기
                            </button>
                        </li>
                    )}
                </ul>
            ) : (
                <div className="mt-1 rounded-lg border border-dashed border-zinc-300 py-7 text-center dark:border-zinc-700">
                    <p className={cn("text-[13px]", MUTED)}>아직 신청한 사람이 없어요</p>
                    <p className={cn("mt-1 text-[12px]", MUTED)}>모집 링크를 공유하면 여기에 쌓입니다</p>
                </div>
            )}

            <div className="mt-5 flex gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <button type="button" onClick={onEdit} className={ACTION_CLASS}>
                    수정
                </button>
                <button
                    type="button"
                    onClick={() => toggleStatus.mutate()}
                    disabled={toggleStatus.isPending}
                    aria-busy={toggleStatus.isPending}
                    className={cn(ACTION_CLASS, MUTED)}
                >
                    {toggleStatus.isPending ? "바꾸는 중…" : recruit.status === "OPEN" ? "마감" : "다시 열기"}
                </button>
            </div>

            {toggleStatus.isError && (
                <p role="alert" className="mt-2 text-center text-[12px] text-red-600 dark:text-red-400">
                    {toggleStatus.error instanceof Error ? toggleStatus.error.message : "바꾸지 못했어요"}
                </p>
            )}
        </div>
    );
}

function RecruitEditForm({
    recruit,
    groupId,
    onSaved,
    onCancel,
}: {
    recruit: Recruit;
    groupId: string;
    onSaved: (recruit: Recruit) => void;
    onCancel: () => void;
}) {
    // datetime-local 입력은 "YYYY-MM-DDTHH:mm" 문자열만 받는다
    const toInputValue = (date?: Date | null) => {
        if (!date) return "";
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RecruitFormValues>({
        mode: "onChange",
        resolver: zodResolver(recruitSchema),
        defaultValues: {
            title: recruit.title ?? "",
            capacity: recruit.userMaxCount ?? undefined,
            startAt: toInputValue(recruit.startAt),
            endAt: toInputValue(recruit.endAt),
            description: recruit.description ?? "",
        },
    });

    const bind = (name: RecruitFieldName) => ({
        registration: register(name),
        error: errors[name]?.message,
    });

    const typedCapacity = Number(useWatch({ control, name: "capacity" }) as string | number | undefined);
    const capacity = Number.isFinite(typedCapacity) && typedCapacity > 0 ? typedCapacity : null;
    // 정원을 이미 신청한 수보다 줄여도 DB는 막지 않는다. 결과를 미리 알려준다.
    const overflow = capacity !== null && capacity < recruit.userCount ? recruit.userCount - capacity : 0;

    const save = useMutation({
        mutationFn: async (data: RecruitFormValues) => {
            const response = await fetch(`/api/v1/group/${groupId}/event/recruit/${recruit.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }).catch(() => null);

            if (!response) throw new Error("연결에 실패했어요. 잠시 뒤 다시 시도해주세요");
            if (!response.ok) {
                throw new Error(response.status === 403 ? "회차를 고칠 권한이 없어요" : "저장하지 못했어요");
            }
            return (await response.json()) as SavedRecruit;
        },
        // 서버가 돌려준 값으로 화면 모델을 갱신한다. 스냅샷을 그냥 두면 카드와 모달이 어긋난다.
        onSuccess: (updated) =>
            onSaved({
                ...recruit,
                title: updated.title,
                description: updated.notice,
                startAt: updated.startAt ? new Date(updated.startAt) : null,
                endAt: updated.endAt ? new Date(updated.endAt) : null,
                userMaxCount: updated.capacity,
            }),
    });

    return (
        <form onSubmit={handleSubmit((data) => save.mutate(data))}>
            <div className="px-4 pt-1">
                <h2 className="text-[17px] font-bold">회차 수정</h2>
                <p className={cn("mt-1 text-[12px]", MUTED)}>
                    이미 신청한 {recruit.userCount}명에게는 영향이 가지 않아요.
                </p>
            </div>

            <NewRecruitForm
                bind={bind}
                capacityNotice={
                    overflow > 0 && (
                        // role="alert"이라야 정원을 줄인 순간 스크린리더가 결과를 읽어준다
                        <div
                            role="alert"
                            className="mx-4 -mt-2 mb-2 flex gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-400/10"
                        >
                            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <p className="text-[12px] leading-relaxed text-amber-700 dark:text-amber-300">
                                이미 {recruit.userCount}명이 신청했어요. {capacity}명으로 줄여도 신청은 취소되지 않고,{" "}
                                {overflow}명이 정원을 넘긴 상태가 됩니다.
                            </p>
                        </div>
                    )
                }
            />

            <div className="sticky bottom-0 -mx-5 -mb-5 mt-4 border-t border-zinc-200 bg-zinc-100 px-9 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <button
                    type="submit"
                    disabled={save.isPending}
                    className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-zinc-900 text-[15px] font-bold text-white transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:disabled:bg-zinc-600"
                >
                    {save.isPending ? "저장하는 중…" : "저장"}
                </button>

                {save.isError && (
                    <p role="alert" className="mt-2 text-center text-[12px] text-red-600 dark:text-red-400">
                        {save.error instanceof Error ? save.error.message : "저장하지 못했어요"}
                    </p>
                )}

                <button
                    type="button"
                    onClick={onCancel}
                    className={cn(
                        "mt-2 min-h-9 w-full cursor-pointer rounded-lg text-[13px] font-medium transition-colors hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100",
                        MUTED,
                    )}
                >
                    취소
                </button>
            </div>
        </form>
    );
}
