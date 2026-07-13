"use client";

import type { Active, Prisma } from "@/generated/prisma/client";

import { useCallback, useEffect, useState } from "react";
import { MemberList } from "../MemberList/MemberList";
import { useForm } from "react-hook-form";
import { MemberField } from "../MemberField/MemberField";
import { MemberNicknameForm } from "@/schemas/setting/group/schemas";
import { SaveButton } from "@/features/setting/components/SaveButton/SaveButton";
import { MemberActiveSetting } from "../MemberActiveSetting/MemberActivSetting";

export type GroupMemberWithUser = Prisma.GroupMemberGetPayload<{
  include: { user: true };
}>;

export type GroupMemberActives = Prisma.MemberActiveGetPayload<{ include: { groupMember: { include: { user: true} }, active: true } }>;

export function MemberForm({ groupid }: { groupid: string }) {
    const [groupMemberActives, setGroupMemberActives] = useState<GroupMemberActives[] | null>(null);
    const [groupAllActives, setGroupAllActives] = useState<Active[]>([]);
    const [assignedMemberActives, setAssignedMemberActives] = useState<GroupMemberActives[]>([]);
    const [members, setMembers] = useState<GroupMemberWithUser[]>([]);
    const [selectedMember, setSelectedMember] = useState<GroupMemberWithUser | null>(null);

    const { register, reset, handleSubmit, formState:{isDirty, isSubmitting} } = useForm<MemberNicknameForm>({ defaultValues: { nickname: selectedMember?.nickname || "" } });

    // 저장 후 다시 불러올 수 있게 useEffect 밖으로 뺀다
    const fetchMemberActives = useCallback(async () => {
        const response = await fetch(`/api/v1/group/${groupid}/memberActive`);
        if (!response.ok) {
            console.error("Failed to fetch member actives", response.status);
            return;
        }
        const data: GroupMemberActives[] = await response.json();
        setGroupMemberActives(data);
    }, [groupid]);

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch(`/api/v1/group/${groupid}/member`);
            if (!response.ok) {
                console.error("Failed to fetch members", response.status);
                return;
            }
            const data: GroupMemberWithUser[] = await response.json();
            setMembers(data);
            setSelectedMember(data[0] ?? null);
        };

        const fetchAllActives = async () => {
            const response = await fetch(`/api/v1/group/${groupid}/actives`);
            if (!response.ok) {
                console.error("Failed to fetch group actives", response.status);
                return;
            }
            const data: Active[] = await response.json();
            setGroupAllActives(data);
        }

        fetchMemberActives();
        fetchAllActives();
        fetchMembers();
    }, [groupid, fetchMemberActives]);


    useEffect(() => {
        if (!selectedMember || !groupMemberActives) {
            setAssignedMemberActives([]);
            return;
        }
        const assigned = groupMemberActives.filter((row) => row.userId === selectedMember.userId);
        setAssignedMemberActives(assigned);
    }, [selectedMember, groupMemberActives]);

    // 선택된 멤버가 바뀌면 폼 기준값도 그 멤버 닉네임으로 다시 잡는다 (isDirty가 멤버별로 올바르게 계산되도록)
    useEffect(() => {
        reset({ nickname: selectedMember?.nickname ?? "" });
    }, [selectedMember, reset]);

    const onSubmit = async (data: MemberNicknameForm) => {
        if (!selectedMember) {
            console.error("No member selected");
            return;
        }

        const response = await fetch(`/api/v1/group/${groupid}/member/${selectedMember.userId}/nickname`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Failed to update nickname", response.status);
            return;
        }

        // 저장 성공 → 제출값을 새 기준값으로 삼아 dirty 해제 (SaveButton 사라짐)
        reset(data);
        // 로컬 목록/선택 상태의 닉네임도 최신화해 멤버를 다시 눌러도 저장값이 유지되게 한다
        setMembers((prev) =>
            prev.map((m) => (m.id === selectedMember.id ? { ...m, nickname: data.nickname } : m)),
        );
        setSelectedMember((prev) => (prev ? { ...prev, nickname: data.nickname } : prev));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <MemberList members={members} selectedMember={selectedMember} onSelectMember={setSelectedMember} />
            <MemberField register={register} />
            <div className="p-4 border-2 rounded-2xl border-gray-200 dark:border-gray-700">
                <MemberActiveSetting
                    groupId={groupid}
                    userId={selectedMember?.userId}
                    groupAllActives={groupAllActives}
                    assignedMemberActives={assignedMemberActives}
                    onSaved={fetchMemberActives}
                />
            </div>
            {isDirty && !isSubmitting && <SaveButton isSubmitting={isSubmitting} />}
        </form>
    )
}