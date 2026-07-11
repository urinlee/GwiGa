import { MemberForm } from "@/features/setting/group/member/MemberForm/MemberForm";


export default async function GroupMemberSettingsPage({ params }: { params: Promise<{ groupid: string }> }) {
    const { groupid } = await params;

    return (
        <div>
            <MemberForm groupid={groupid} />
        </div>
    );
}