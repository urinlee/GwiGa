-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "Statuses" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "Tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
