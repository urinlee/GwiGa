/*
  Warnings:

  - A unique constraint covering the columns `[id,groupId]` on the table `GroupNotice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "GroupNoticeReadMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupNoticeReadMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupNoticeReadMember_noticeId_userId_key" ON "GroupNoticeReadMember"("noticeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupNotice_id_groupId_key" ON "GroupNotice"("id", "groupId");

-- AddForeignKey
ALTER TABLE "GroupNoticeReadMember" ADD CONSTRAINT "GroupNoticeReadMember_noticeId_groupId_fkey" FOREIGN KEY ("noticeId", "groupId") REFERENCES "GroupNotice"("id", "groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupNoticeReadMember" ADD CONSTRAINT "GroupNoticeReadMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "GroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
