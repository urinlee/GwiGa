/*
  Warnings:

  - The values [JOIN] on the enum `ActiveType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `PaymentActive` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyActive` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecruitStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ApplicantStatus" AS ENUM ('APPLIED', 'CANCELED');

-- 수동 교정: Prisma가 생성한 순서로는 실패한다.
-- enum 값을 빼려면 새 타입을 만들어 컬럼을 갈아끼우는데, 그때
-- Active.type을 참조하는 PaymentActive/SurveyActive의 복합 FK가 살아 있으면
-- 42804(타입 불일치)가 난다. 또 원본은 아직 만들어지지도 않은
-- PaymentModule/SurveyModule을 건드린다.
-- 두 테이블은 비어 있고 어차피 Module로 대체되므로, enum 교체 전에 먼저 없앤다.

-- DropForeignKey
ALTER TABLE "PaymentActive" DROP CONSTRAINT "PaymentActive_activeId_type_fkey";

-- DropForeignKey
ALTER TABLE "SurveyActive" DROP CONSTRAINT "SurveyActive_activeId_type_fkey";

-- DropTable
DROP TABLE "PaymentActive";

-- DropTable
DROP TABLE "SurveyActive";

-- AlterEnum (이제 Active.type만 이 enum을 쓴다)
BEGIN;
CREATE TYPE "ActiveType_new" AS ENUM ('MANUAL', 'PAYMENT', 'SURVEY');
ALTER TABLE "public"."Active" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Active" ALTER COLUMN "type" TYPE "ActiveType_new" USING ("type"::text::"ActiveType_new");
ALTER TYPE "ActiveType" RENAME TO "ActiveType_old";
ALTER TYPE "ActiveType_new" RENAME TO "ActiveType";
DROP TYPE "public"."ActiveType_old";
ALTER TABLE "Active" ALTER COLUMN "type" SET DEFAULT 'MANUAL';
COMMIT;

-- CreateTable
CREATE TABLE "Recruit" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT,
    "notice" TEXT,
    "status" "RecruitStatus" NOT NULL DEFAULT 'OPEN',
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recruit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruitApplicant" (
    "id" TEXT NOT NULL,
    "recruitId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" "ApplicantStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canceledAt" TIMESTAMP(3),

    CONSTRAINT "RecruitApplicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentModule" (
    "activeId" TEXT NOT NULL,
    "type" "ActiveType" NOT NULL DEFAULT 'PAYMENT',
    "amount" INTEGER NOT NULL,
    "dueAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "SurveyModule" (
    "activeId" TEXT NOT NULL,
    "type" "ActiveType" NOT NULL DEFAULT 'SURVEY',
    "surveyUrl" TEXT NOT NULL,
    "closedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE INDEX "Recruit_eventId_status_idx" ON "Recruit"("eventId", "status");

-- CreateIndex
CREATE INDEX "RecruitApplicant_recruitId_status_idx" ON "RecruitApplicant"("recruitId", "status");

-- CreateIndex
CREATE INDEX "RecruitApplicant_memberId_idx" ON "RecruitApplicant"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruitApplicant_recruitId_memberId_key" ON "RecruitApplicant"("recruitId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentModule_activeId_key" ON "PaymentModule"("activeId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentModule_activeId_type_key" ON "PaymentModule"("activeId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyModule_activeId_key" ON "SurveyModule"("activeId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyModule_activeId_type_key" ON "SurveyModule"("activeId", "type");

-- AddForeignKey
ALTER TABLE "Recruit" ADD CONSTRAINT "Recruit_eventId_groupId_fkey" FOREIGN KEY ("eventId", "groupId") REFERENCES "Event"("id", "groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitApplicant" ADD CONSTRAINT "RecruitApplicant_recruitId_fkey" FOREIGN KEY ("recruitId") REFERENCES "Recruit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitApplicant" ADD CONSTRAINT "RecruitApplicant_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentModule" ADD CONSTRAINT "PaymentModule_activeId_type_fkey" FOREIGN KEY ("activeId", "type") REFERENCES "Active"("id", "type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyModule" ADD CONSTRAINT "SurveyModule_activeId_type_fkey" FOREIGN KEY ("activeId", "type") REFERENCES "Active"("id", "type") ON DELETE CASCADE ON UPDATE CASCADE;
