/*
  Warnings:

  - You are about to drop the `GroupNoticeReadMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupNoticeReadMember" DROP CONSTRAINT "GroupNoticeReadMember_memberId_fkey";

-- DropForeignKey
ALTER TABLE "GroupNoticeReadMember" DROP CONSTRAINT "GroupNoticeReadMember_noticeId_groupId_fkey";

-- DropTable
DROP TABLE "GroupNoticeReadMember";

-- CreateTable
CREATE TABLE "GroupNoticeRead" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupNoticeRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupNoticeRead_noticeId_memberId_idx" ON "GroupNoticeRead"("noticeId", "memberId");

-- CreateIndex
CREATE INDEX "GroupNoticeRead_memberId_idx" ON "GroupNoticeRead"("memberId");

-- AddForeignKey
ALTER TABLE "GroupNoticeRead" ADD CONSTRAINT "GroupNoticeRead_noticeId_groupId_fkey" FOREIGN KEY ("noticeId", "groupId") REFERENCES "GroupNotice"("id", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupNoticeRead" ADD CONSTRAINT "GroupNoticeRead_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
