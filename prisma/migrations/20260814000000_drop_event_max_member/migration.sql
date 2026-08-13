-- 이벤트 정원은 회차(Recruit)의 capacity 합으로 파생시킨다.
-- minMember는 참고용 목표 인원으로 남는다.
ALTER TABLE "Event" DROP COLUMN "maxMember";
