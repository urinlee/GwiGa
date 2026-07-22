-- AlterTable
ALTER TABLE "GroupNotice" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ActiveType" (
    "id" TEXT NOT NULL,
    "activeId" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ActiveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentActive" (
    "id" TEXT NOT NULL,
    "memberActiveId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentActive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyActive" (
    "id" TEXT NOT NULL,
    "memberActiveId" TEXT NOT NULL,

    CONSTRAINT "SurveyActive_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActiveType" ADD CONSTRAINT "ActiveType_activeId_fkey" FOREIGN KEY ("activeId") REFERENCES "Active"("id") ON DELETE CASCADE ON UPDATE CASCADE;
