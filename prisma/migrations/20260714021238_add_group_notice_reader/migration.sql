-- CreateTable
CREATE TABLE "GroupNoticeBadge" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'default',
    "content" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupNoticeBadge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupNotice" ADD CONSTRAINT "GroupNotice_id_fkey" FOREIGN KEY ("id") REFERENCES "GroupNoticeBadge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupNoticeBadge" ADD CONSTRAINT "GroupNoticeBadge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
