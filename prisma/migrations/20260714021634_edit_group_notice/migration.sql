/*
  Warnings:

  - You are about to drop the column `content` on the `GroupNoticeBadge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupNoticeBadge" DROP COLUMN "content",
ADD COLUMN     "color" TEXT DEFAULT '#F4F4F5',
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT;
