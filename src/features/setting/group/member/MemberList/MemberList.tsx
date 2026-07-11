'use client'
import { useHangulFuzzySearch } from "@/hooks/useHangulFuzzySearch";
import { Search, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { GroupMemberWithUser } from "../MemberForm/MemberForm";

/** 렌더마다 새 함수가 되지 않도록 컴포넌트 바깥에 둔다 (검색 인덱스 재생성 방지) */
const getMemberName = (member: GroupMemberWithUser) => member.user.name || "";

export function MemberListCard({ member, isSelected, onClick }: { member: GroupMemberWithUser; isSelected?: boolean; onClick?: () => void }) {
    return (
        <div
            className={`flex px-4 py-2 justify-between items-center border-zinc-200 bg-zinc-100 border rounded-lg cursor-pointer ${isSelected ? "bg-zinc-200" : ""}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                {member.user.image && <img src={member.user.image} alt={member.user.name || ""} className="w-8 h-8 rounded-full" />}
                <span className="text-lg font-bold">{member.nickname || member.user.name}</span>
            </div>
            <span className="text-sm text-zinc-500">{member.user.name}</span>
        </div>
    )
}



interface MemberListProps {
    members: GroupMemberWithUser[];
    selectedMember?: GroupMemberWithUser | null;
    onSelectMember?: (member: GroupMemberWithUser) => void;
}


export function MemberList({ members, selectedMember, onSelectMember }: MemberListProps) {

    const { register, watch } = useForm<{ search: string }>();

    const searchValue = watch("search", "");
    const filteredMembers = useHangulFuzzySearch(members, searchValue, getMemberName);

    return (
        <div className="flex flex-col gap-7 p-4 border-zinc-500 border rounded-2xl">
            <div className="border rounded-lg border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900/40">
                <div className="h-50  overflow-y-auto">
                    {filteredMembers.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-sm text-zinc-400 dark:text-zinc-500">
                            검색 결과가 없어요
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {filteredMembers.map((member) => (
                                <MemberListCard
                                    key={member.id}
                                    member={member}
                                    isSelected={selectedMember?.id === member.id}
                                    onClick={() => onSelectMember?.(member)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* 주요 액션: 초대 */}
                <button
                    type="button"
                    className="group flex h-11 w-40 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-b from-mist-800 to-mist-700 px-4 text-sm font-bold text-white shadow-sm shadow-emerald-600/25 ring-1 ring-inset ring-white/20 transition-all duration-200 hover:to-mist-600 hover:shadow-md hover:shadow-mist-600/35 active:scale-[0.98]"
                >
                    <UserPlus size={16} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
                    초대하기
                </button>

                {/* 검색 입력 */}
                <div className="flex h-11 flex-1 items-center rounded-full border border-transparent bg-zinc-200 px-4 transition-colors focus-within:border-zinc-400 focus-within:bg-zinc-100 dark:bg-zinc-800 dark:focus-within:border-zinc-500 dark:focus-within:bg-zinc-800/60">
                    <Search size={16} className="shrink-0 text-zinc-500 dark:text-zinc-400" />
                    <input
                        className="ml-2 w-full min-w-0 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-400"
                        placeholder="멤버 검색"
                        {...register("search")}
                    />
                </div>

                {/* 보조 액션: 검색 실행 */}
                {/* <button
                    type="button"
                    className="h-11 w-20 shrink-0 cursor-pointer rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-700 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                    검색
                </button> */}
            </div>
        </div>
    )
}