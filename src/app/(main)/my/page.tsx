import ContentSectionContainer, { contentSectionContainerProps } from "@/features/my/components/ContentSectionContainer/ContentSectionContainer.";
import { HistoryContentSectionProps } from "@/features/my/components/HistoryContentSection/HistoryContentSection";
import { getCurrentUser } from "@/utils/currentUser";
import { ImAdminGroup, ImGroupMember } from "@/services/group";



// const TestPropsToContentSectionContainer: HistoryContentSectionProps[] = [
//     {
//         title: "과 신입생입학환영회",
//         date: "2026-06-01",
//         status: "체크됨",
//     },
//     {
//         title: "과 개강총회",
//         date: "2024-06-01",
//         status: "예정",
//     },
//     {
//         title: "단과대 MT",
//         date: "2024-06-01",
//         status: "예정",
//     },
//     {
//         title: "동아리 MT",
//         date: "2024-06-01",
//         status: "예정",
//     },
//     {
//         title: "고등학교 동창회",
//         date: "2024-06-01",
//         status: "예정",
//     },
//     ] as const;

////DONE: 서버에서 받아오는 데이터로 바꿔야함. 지금은 테스트용으로 하드코딩해둠. Compelete

//TODO: Status를 하드코딩 해둠 추후 변경할것!

export default async function MyPage() {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return(<></>)
    }
    const userId = currentUser.id
    const adminGroupsRes = await ImAdminGroup(userId) || []
    const memberGroupsRes = await ImGroupMember(userId) || []

    const adminGroups = Array.isArray(adminGroupsRes) ? adminGroupsRes : (adminGroupsRes?.AdminGroups ?? [])
    const OnlyMemberGroups = [...memberGroupsRes].map((value, _)=>(value.group))

    const userAdminGroupInfo = adminGroups.map((group) => ({
        id: group.id,
        admin:true,
        title: group.name,
        date: group.createdAt.toString(),
        status: "test",
    }))

    const userMemberGroupInfo = OnlyMemberGroups.map((group) => ({
        id: group.id,
        admin:false,
        title: group.name,
        date: group.createdAt.toString(),
        status: "test",
    }))

    const userGroupInfos = [...userAdminGroupInfo, ...userMemberGroupInfo]

    


    return (
        <div className="flex flex-col gap-4 py-20">
            <ContentSectionContainer HistoryContents={[...userGroupInfos]} />

        </div>
    );
}
