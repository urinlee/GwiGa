/*
  Warnings:

  - You are about to drop the column `Statuses` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `Tags` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "Statuses",
DROP COLUMN "Tags",
ADD COLUMN     "statuses" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
