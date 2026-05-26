import ContentSectionContainer from "@/features/RUOK/components/ContentSectionContainer/ContentSectionContainer.";
import { HistoryContentSectionProps } from "@/features/RUOK/components/HistoryContentSection/HistoryContentSection";



const TestPropsToContentSectionContainer: HistoryContentSectionProps[] = [
    {
        title: "과 신입생입학환영회",
        date: "2026-06-01",
        status: "체크됨",
    },
    {
        title: "과 개강총회",
        date: "2024-06-01",
        status: "예정",
    },
    {
        title: "단과대 MT",
        date: "2024-06-01",
        status: "예정",
    },
    {
        title: "동아리 MT",
        date: "2024-06-01",
        status: "예정",
    },
    {
        title: "고등학교 동창회",
        date: "2024-06-01",
        status: "예정",
    },
    ] as const;

    //TODO: 서버에서 받아오는 데이터로 바꿔야함. 지금은 테스트용으로 하드코딩해둠.

export default function RUOK() {
  return (
    <div className="flex flex-col gap-4 py-20">
        <ContentSectionContainer HistoryContents={TestPropsToContentSectionContainer} />

    </div>
  );
}
