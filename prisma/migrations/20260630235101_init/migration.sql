/*
  Warnings:

  - You are about to drop the column `statusId` on the `MemberStatus` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId,userId,activeId]` on the table `MemberStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activeId` to the `MemberStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MemberStatus" DROP CONSTRAINT "MemberStatus_statusId_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_groupId_fkey";

-- DropIndex
DROP INDEX "MemberStatus_groupId_userId_statusId_key";

-- AlterTable
ALTER TABLE "MemberStatus" DROP COLUMN "statusId",
ADD COLUMN     "activeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Status";

-- CreateTable
CREATE TABLE "Active" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "primaryColor" TEXT DEFAULT '#F4F4F5',
    "secondaryColor" TEXT DEFAULT '#57565C',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Active_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Active_id_groupId_key" ON "Active"("id", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberStatus_groupId_userId_activeId_key" ON "MemberStatus"("groupId", "userId", "activeId");

-- AddForeignKey
ALTER TABLE "Active" ADD CONSTRAINT "Active_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatus" ADD CONSTRAINT "MemberStatus_activeId_groupId_fkey" FOREIGN KEY ("activeId", "groupId") REFERENCES "Active"("id", "groupId") ON DELETE RESTRICT ON UPDATE CASCADE;
