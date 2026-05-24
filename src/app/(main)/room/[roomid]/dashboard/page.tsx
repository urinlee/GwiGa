//pc에선 dashboard page만 만든다. 모바일에서는 room page도 만든다. pc에서는 room page는 만들지 않는다.

import DashboardHero from "@/features/dashboard/components/DashboardHero/DashboardHero";
import InfoCardsContainer from "@/features/dashboard/components/InfoCardsContainer/InfoCardsContainer";
import { participateContentStatus } from "@/types/status";



interface DashboardPageProps {
  params: {
    roomid: string;
  };
}


// 테스트를 위한 임의의 참가자 데이터 생성 추후 백엔드 연결로 불러옴
//=========================================================================================
const ExampleallStatus: participateContentStatus[] = ["입금", "도착", "귀가", "뒤풀이", "몰라"]

const getRandomStatus = () => {
    const randomCount = Math.floor(Math.random() * ExampleallStatus.length) + 1;
    return [...ExampleallStatus].sort(() => Math.random() - 0.5).slice(0, randomCount);
}

const testParticipants = Array.from({ length: 52 }, (_, index) => ({
    username: `참가자 ${index + 1}`,
    enableStatus: getRandomStatus(),
    allStatus: ExampleallStatus,
}));

//=========================================================================================


//TODO: 백엔드에서 방 정보, 참가자 정보 불러와서 렌더링하도록 수정

export default async function DashboardPage({
  params,
}: DashboardPageProps) {
  const { roomid } = await params

  return (<div className="flex flex-col gap-20 my-10">
    <DashboardHero
      roomName="과 개강총회"
      description="과 개강총회입니다. 많은 참여 부탁드립니다!"
      date="2026-10-01"
      time="17:00 - 20:00"
      location="쩡이포차"
      participantCount={100}
    />
    <InfoCardsContainer participants={testParticipants} />
  </div>)
}