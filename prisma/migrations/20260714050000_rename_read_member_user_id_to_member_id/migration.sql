-- GroupNoticeReadMember.userId 는 이름과 달리 처음부터 GroupMember.id 를 참조하고 있었다.
-- 값은 그대로 두고 컬럼명만 실제 의미(memberId)에 맞춘다 — DROP/ADD 가 아닌 RENAME 이므로 기존 읽음 기록은 보존된다.
ALTER TABLE "GroupNoticeReadMember" RENAME COLUMN "userId" TO "memberId";

ALTER TABLE "GroupNoticeReadMember"
    RENAME CONSTRAINT "GroupNoticeReadMember_userId_fkey" TO "GroupNoticeReadMember_memberId_fkey";

ALTER INDEX "GroupNoticeReadMember_noticeId_userId_key"
    RENAME TO "GroupNoticeReadMember_noticeId_memberId_key";

-- 공지 FK 가 RESTRICT 라서 읽음 기록이 하나라도 있으면 공지 삭제가 FK 위반으로 실패했다. CASCADE 로 바꾼다.
ALTER TABLE "GroupNoticeReadMember" DROP CONSTRAINT "GroupNoticeReadMember_noticeId_groupId_fkey";
ALTER TABLE "GroupNoticeReadMember" ADD CONSTRAINT "GroupNoticeReadMember_noticeId_groupId_fkey"
    FOREIGN KEY ("noticeId", "groupId") REFERENCES "GroupNotice"("id", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;
