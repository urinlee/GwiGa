//pc에선 dashboard page만 만든다. 모바일에서는 group page도 만든다. pc에서는 group page는 만들지 않는다.

import DashboardFastSetting from "@/features/dashboard/components/DashboardFastSetting/DashboardFastSetting";
import DashboardHero from "@/features/dashboard/components/DashboardHero/DashboardHero";
import InfoCardsContainer, { stateType } from "@/features/dashboard/components/InfoCardsContainer/InfoCardsContainer";
import { ParticipantsInfoCardProps, ParticipateStatusProps } from "@/features/dashboard/components/ParticipateInfoCard/ParticipantsInfoCard";
import { prisma } from "@/lib/prisma";
import { getGroup } from "@/services/group";
import valueProcessor from "next/dist/build/webpack/loaders/resolve-url-loader/lib/value-processor";



interface DashboardPageProps {
  params: {
    groupid: string;
  };
}




// 테스트를 위한 임의의 참가자 데이터 생성 추후 백엔드 연결로 불러옴
//=========================================================================================
// const ExampleallStatus: participateContentStatus[] = ["입금", "도착", "귀가", "뒤풀이", "몰라"]

// const getRandomStatus = () => {
//     const randomCount = Math.floor(Math.random() * ExampleallStatus.length) + 1;
//     return [...ExampleallStatus].sort(() => Math.random() - 0.5).slice(0, randomCount);
// }

// const testParticipants = Array.from({ length: 52 }, (_, index) => ({
//     username: `참가자 ${index + 1}`,
//     enableStatus: getRandomStatus(),
//     allStatus: ExampleallStatus,
// }));

//=========================================================================================


//TODO: 백엔드에서 방 정보, 참가자 정보 불러와서 렌더링하도록 수정

export default async function DashboardPage({
  params,
}: DashboardPageProps) {
  const { groupid } = await params


  const Group = await prisma.group.findUnique({
    where:{
      id:groupid
    },
    include: {
      actives:{
        include:{
          memberActives:true
        }
      },
      members: {
        include:{
          user:true,
          memberActives:{
            include:{
              active:true
            }
          },
        }
      }
    },
  })

  const GroupInfo = {
    name:Group?.name,
    description:Group?.description,
    createdAt:Group?.createdAt,
    tags:Group?.tags,
  }
  
  const participants = (Group?.members ?? []).map((Member) => ({
    username: Member.user.name || "",
    userStatus:[...Member.memberActives].map((memberStatus, _) => ({
      id:memberStatus.active.id,
      name:memberStatus.active.name,
      primaryColor:memberStatus.active.primaryColor,
      secondaryColor:memberStatus.active.secondaryColor,
      isTrue:memberStatus.enable,
    }))
  })) as ParticipantsInfoCardProps[]


  const allStatus = ((Group?.actives ?? [])
    .filter((value, _) => value.memberActives.length)
    .map((eachStatus, _) => ({
      id: eachStatus.id,
      name: eachStatus.name,
      primaryColor: eachStatus.primaryColor,
      secondaryColor: eachStatus.secondaryColor,
    })) as stateType[])



  return (<div className="flex flex-col gap-10 my-10">
    <DashboardHero
      groupName={GroupInfo?.name || ""}
      description={GroupInfo?.description || ""}
      date={GroupInfo?.createdAt?.toLocaleDateString()}
      tags={GroupInfo?.tags?.map((value, _)=>`#${value}`).join(", ")}
      location="쩡이포차"
      participantCount={100}
    />
    <DashboardFastSetting groupId={groupid}/>
    <InfoCardsContainer participants={participants} allStatuses={allStatus}/>
  </div>)
}