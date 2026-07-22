/*
  Warnings:

  - You are about to drop the column `color` on the `GroupNoticeBadge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GroupNoticeBadge" DROP COLUMN "color",
ADD COLUMN     "backgroundColor" TEXT DEFAULT '#a1a1a1',
ADD COLUMN     "textColor" TEXT DEFAULT '#ffffff';
