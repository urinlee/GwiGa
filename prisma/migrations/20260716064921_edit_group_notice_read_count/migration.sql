/*
  Warnings:

  - The `readAt` column on the `GroupNoticeReadMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GroupNoticeReadMember" DROP COLUMN "readAt",
ADD COLUMN     "readAt" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
