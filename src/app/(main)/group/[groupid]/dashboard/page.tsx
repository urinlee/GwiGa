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
    username: Member.nickname || Member.user.name,
    avatarUrl: Member.user.image,
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