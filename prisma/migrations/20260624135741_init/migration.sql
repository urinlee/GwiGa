/*
  Warnings:

  - You are about to drop the column `statuses` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "statuses";

-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberStatus" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL,

    CONSTRAINT "MemberStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_id_groupId_key" ON "Status"("id", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberStatus_groupId_userId_statusId_key" ON "MemberStatus"("groupId", "userId", "statusId");

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatus" ADD CONSTRAINT "MemberStatus_groupId_userId_fkey" FOREIGN KEY ("groupId", "userId") REFERENCES "GroupMember"("groupId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatus" ADD CONSTRAINT "MemberStatus_statusId_groupId_fkey" FOREIGN KEY ("statusId", "groupId") REFERENCES "Status"("id", "groupId") ON DELETE RESTRICT ON UPDATE CASCADE;
