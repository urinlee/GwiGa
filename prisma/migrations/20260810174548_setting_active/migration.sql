/*
  Warnings:

  - You are about to drop the column `prerequisiteId` on the `Active` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- DropForeignKey
ALTER TABLE "Active" DROP CONSTRAINT "Active_prerequisiteId_groupId_fkey";

-- AlterTable
ALTER TABLE "Active" DROP COLUMN "prerequisiteId",
ADD COLUMN     "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE';
