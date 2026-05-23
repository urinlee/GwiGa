// "use client";
//pc에선 dashboard page만 만든다. 모바일에서는 room page도 만든다. pc에서는 room page는 만들지 않는다.

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



export default async function DashboardPage({
  params,
}: DashboardPageProps) {
  const { roomid } = await params

  return <div>
    <InfoCardsContainer participants={testParticipants} />
  </div>
}