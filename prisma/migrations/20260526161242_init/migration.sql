-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomStatus" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "RoomStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "imageUrl" TEXT,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantStatus" (
    "participantId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,

    CONSTRAINT "ParticipantStatus_pkey" PRIMARY KEY ("participantId","statusId")
);

-- CreateIndex
CREATE INDEX "RoomStatus_roomId_idx" ON "RoomStatus"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomStatus_roomId_label_key" ON "RoomStatus"("roomId", "label");

-- CreateIndex
CREATE INDEX "Participant_roomId_idx" ON "Participant"("roomId");

-- CreateIndex
CREATE INDEX "ParticipantStatus_statusId_idx" ON "ParticipantStatus"("statusId");

-- AddForeignKey
ALTER TABLE "RoomStatus" ADD CONSTRAINT "RoomStatus_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantStatus" ADD CONSTRAINT "ParticipantStatus_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantStatus" ADD CONSTRAINT "ParticipantStatus_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "RoomStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
