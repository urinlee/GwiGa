/*
  Warnings:

  - You are about to drop the column `count` on the `GroupNoticeBadge` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupNotice" DROP CONSTRAINT "GroupNotice_id_fkey";

-- AlterTable
ALTER TABLE "GroupNotice" ADD COLUMN     "badgeId" TEXT;

-- AlterTable
ALTER TABLE "GroupNoticeBadge" DROP COLUMN "count";

-- AddForeignKey
ALTER TABLE "GroupNotice" ADD CONSTRAINT "GroupNotice_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "GroupNoticeBadge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
