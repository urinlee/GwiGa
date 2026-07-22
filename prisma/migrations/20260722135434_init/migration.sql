/*
  Warnings:

  - The primary key for the `PaymentActive` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dueDate` on the `PaymentActive` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `PaymentActive` table. All the data in the column will be lost.
  - You are about to drop the column `memberActiveId` on the `PaymentActive` table. All the data in the column will be lost.
  - The primary key for the `SurveyActive` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SurveyActive` table. All the data in the column will be lost.
  - You are about to drop the column `memberActiveId` on the `SurveyActive` table. All the data in the column will be lost.
  - You are about to drop the `ActiveType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,type]` on the table `Active` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeId]` on the table `PaymentActive` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeId,type]` on the table `PaymentActive` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeId]` on the table `SurveyActive` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeId,type]` on the table `SurveyActive` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activeId` to the `PaymentActive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeId` to the `SurveyActive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyUrl` to the `SurveyActive` table without a default value. This is not possible if the table is not empty.

*/
-- 수동 교정: PostgreSQL은 테이블과 타입이 같은 이름 공간을 공유한다.
-- 같은 이름의 enum을 만들기 전에 기존 "ActiveType" 테이블을 먼저 없애야
-- 42710 (type already exists) 이 나지 않는다. Prisma가 생성한 원래 순서는
-- CREATE TYPE 이 DROP TABLE 보다 앞이라 반드시 실패한다.

-- DropForeignKey
ALTER TABLE "ActiveType" DROP CONSTRAINT "ActiveType_activeId_fkey";

-- DropTable
DROP TABLE "ActiveType";

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('RECRUITING', 'ONGOING', 'CLOSED');

-- CreateEnum
CREATE TYPE "ActiveType" AS ENUM ('MANUAL', 'JOIN', 'PAYMENT', 'SURVEY');

-- AlterTable
ALTER TABLE "Active" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "prerequisiteId" TEXT,
ADD COLUMN     "selfServe" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "ActiveType" NOT NULL DEFAULT 'MANUAL';

-- AlterTable
ALTER TABLE "MemberActive" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PaymentActive" DROP CONSTRAINT "PaymentActive_pkey",
DROP COLUMN "dueDate",
DROP COLUMN "id",
DROP COLUMN "memberActiveId",
ADD COLUMN     "activeId" TEXT NOT NULL,
ADD COLUMN     "dueAt" TIMESTAMP(3),
ADD COLUMN     "type" "ActiveType" NOT NULL DEFAULT 'PAYMENT';

-- AlterTable
ALTER TABLE "SurveyActive" DROP CONSTRAINT "SurveyActive_pkey",
DROP COLUMN "id",
DROP COLUMN "memberActiveId",
ADD COLUMN     "activeId" TEXT NOT NULL,
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "surveyUrl" TEXT NOT NULL,
ADD COLUMN     "type" "ActiveType" NOT NULL DEFAULT 'SURVEY';

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'RECRUITING',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_groupId_key" ON "Event"("id", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Active_id_type_key" ON "Active"("id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentActive_activeId_key" ON "PaymentActive"("activeId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentActive_activeId_type_key" ON "PaymentActive"("activeId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyActive_activeId_key" ON "SurveyActive"("activeId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyActive_activeId_type_key" ON "SurveyActive"("activeId", "type");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Active" ADD CONSTRAINT "Active_prerequisiteId_groupId_fkey" FOREIGN KEY ("prerequisiteId", "groupId") REFERENCES "Active"("id", "groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Active" ADD CONSTRAINT "Active_eventId_groupId_fkey" FOREIGN KEY ("eventId", "groupId") REFERENCES "Event"("id", "groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentActive" ADD CONSTRAINT "PaymentActive_activeId_type_fkey" FOREIGN KEY ("activeId", "type") REFERENCES "Active"("id", "type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyActive" ADD CONSTRAINT "SurveyActive_activeId_type_fkey" FOREIGN KEY ("activeId", "type") REFERENCES "Active"("id", "type") ON DELETE CASCADE ON UPDATE CASCADE;
