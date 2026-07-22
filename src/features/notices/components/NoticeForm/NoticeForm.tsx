"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/cn";
import { groupNoticeSchema } from "@/schemas/schemas";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor/MarkdownEditor";
import { NoticeContent } from "../NoticeContent/NoticeContent";

export interface NoticeFormBadge {
    id: string;
    name: string;
    backgroundColor?: string | null;
    textColor?: string | null;
}

// 서버 라우트와 같은 스키마(title·content)를 재사용하고, 폼 전용 badgeId만 확장한다
const noticeFormSchema = groupNoticeSchema.extend({
    badgeId: z.string().optional(),
});
type NoticeFormValues = z.infer<typeof noticeFormSchema>;



interface NoticeFormProps {
    groupId: string;
    /** 그룹의 배지 목록. 넘기면 선택 UI가 렌더된다. */
    badges?: NoticeFormBadge[];
}

interface NoticeEditForm extends NoticeFormProps {
    noticeId?: string;
    defaultValues?: NoticeFormValues;
}

export function NoticeForm({ groupId, badges = [], ...editProps}: NoticeFormProps | NoticeEditForm) {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm<NoticeFormValues>({
        resolver: zodResolver(noticeFormSchema),
        mode: "onChange",
        defaultValues: "defaultValues" in editProps && editProps.defaultValues ? editProps.defaultValues : { title: "", content: "", badgeId: undefined },
    });

    const badgeId = watch("badgeId");

    const onSubmit = async (data: NoticeFormValues) => {
        if ("noticeId" in editProps && editProps.noticeId) {
            // 수정
            await fetch(`/api/v1/group/${groupId}/groupnotice/${editProps.noticeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: data.title,
                    content: data.content,
                    badgeId: data.badgeId,
                }),
            });
            router.push(`/group/${groupId}/notices/${editProps.noticeId}`); // 수정 후 상세로 이동
            return;
        }
        else{
            await fetch(`/api/v1/group/${groupId}/groupnotice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: data.title,
                    content: data.content,
                    badgeId: data.badgeId,
                }),
            });
            router.push(`/group/${groupId}/notices`); // 작성 후 목록으로 이동
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 py-10">
            {/* 헤더 */}
            <div>
                <a href={`/group/${groupId}/notices`} className="text-[12px] text-zinc-500 hover:underline">
                    &lt; 목록으로 돌아가기
                </a>
                <h1 className="mt-3 text-4xl font-bold">새 공지 작성</h1>
                <p className="mt-2 text-sm text-zinc-500">그룹 멤버 모두에게 보여요. 내용은 마크다운을 지원해요.</p>
            </div>

            {/* 제목 */}
            <div className="flex flex-col gap-2">
                <label htmlFor="notice-title" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                    제목
                </label>
                <input
                    id="notice-title"
                    {...register("title")}
                    placeholder="공지 제목을 입력하세요"
                    className={cn(
                        "rounded-xl border bg-white px-4 py-3 text-lg font-semibold outline-none transition-colors placeholder:font-normal placeholder:text-zinc-400 dark:bg-zinc-900/40",
                        errors.title
                            ? "border-red-400 focus:border-red-500"
                            : "border-zinc-300 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-500",
                    )}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            {/* 배지 */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                    배지 <span className="font-normal text-zinc-400">(선택)</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setValue("badgeId", undefined)}
                        className={cn(
                            "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors",
                            badgeId === undefined
                                ? "border-transparent bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50",
                        )}
                    >
                        없음
                    </button>
                    {badges.map((badge) => (
                        <button
                            key={badge.id}
                            type="button"
                            onClick={() => setValue("badgeId", badge.id)}
                            className={cn(
                                "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                                badgeId === badge.id
                                    ? "border-transparent px-6 py-2 text-lg ring ring-zinc-900 dark:ring-zinc-100"
                                    : "border-zinc-300 hover:opacity-75 dark:border-zinc-700",
                            )}
                            style={{
                                backgroundColor: badge.backgroundColor ?? undefined,
                                color: badge.textColor ?? undefined,
                            }}
                        >
                            {badge.name}
                        </button>
                    ))}
                    {badges.length === 0 && (
                        <span className="text-sm text-zinc-400">등록된 배지가 없어요</span>
                    )}
                </div>
            </div>

            {/* 내용 — 서식 툴바 + 미리보기 (미리보기는 실제 공지와 동일한 NoticeContent로 렌더) */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">내용</span>
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <MarkdownEditor
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={"공지 내용을 입력하세요.\n\n# 제목\n- 목록\n**굵게**"}
                            hasError={Boolean(errors.content)}
                            renderPreview={(value) => <NoticeContent content={value} />}
                        />
                    )}
                />
                {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}

                <p className="text-xs text-zinc-400">
                    마크다운 지원 — 엔터로 줄바꿈, 표·체크리스트도 됩니다
                </p>
            </div>

            {/* 액션 */}
            <div className="flex justify-end gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <button
                    type="button"
                    onClick={() => router.push(`/group/${groupId}/notices`)}
                    className="cursor-pointer rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/50"
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="cursor-pointer rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    {isSubmitting ? "등록 중…" : "공지 등록"}
                </button>
            </div>
        </form>
    );
}
