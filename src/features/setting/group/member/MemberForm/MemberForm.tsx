"use client";

import type { Prisma } from "@/generated/prisma/client";

import { useEffect, useState } from "react";
import { MemberList } from "../MemberList/MemberList";
import { useForm } from "react-hook-form";
import { MemberField } from "../MemberField/MemberField";

export type GroupMemberWithUser = Prisma.GroupMemberGetPayload<{
  include: { user: true };
}>;

export function MemberForm({ groupid }: { groupid: string }) {
    const [members, setMembers] = useState<GroupMemberWithUser[]>([]);
    const [selectedMember, setSelectedMember] = useState<GroupMemberWithUser | null>(null);

    const { register } = useForm();

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch(`/api/group/${groupid}/member`);
            if (!response.ok) {
                console.error("Failed to fetch members", response.status);
                return;
            }
            const data: GroupMemberWithUser[] = await response.json();
            setMembers(data);
            setSelectedMember(data[0] ?? null);
        };

        fetchMembers();
    }, [groupid]);

    return (
        <form>
            <MemberList members={members} selectedMember={selectedMember} onSelectMember={setSelectedMember} />
            <MemberField register={register} />
        </form>
    )
}