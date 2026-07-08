/*
  Warnings:

  - You are about to drop the `MemberStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemberStatus" DROP CONSTRAINT "MemberStatus_activeId_groupId_fkey";

-- DropForeignKey
ALTER TABLE "MemberStatus" DROP CONSTRAINT "MemberStatus_groupId_userId_fkey";

-- DropTable
DROP TABLE "MemberStatus";

-- CreateTable
CREATE TABLE "MemberActive" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL,

    CONSTRAINT "MemberActive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberActive_groupId_userId_activeId_key" ON "MemberActive"("groupId", "userId", "activeId");

-- AddForeignKey
ALTER TABLE "MemberActive" ADD CONSTRAINT "MemberActive_groupId_userId_fkey" FOREIGN KEY ("groupId", "userId") REFERENCES "GroupMember"("groupId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberActive" ADD CONSTRAINT "MemberActive_activeId_groupId_fkey" FOREIGN KEY ("activeId", "groupId") REFERENCES "Active"("id", "groupId") ON DELETE RESTRICT ON UPDATE CASCADE;
