-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- AlterTable
ALTER TABLE "InstituteStudent" ADD COLUMN     "floorId" INTEGER,
ADD COLUMN     "roomId" INTEGER;

-- CreateTable
CREATE TABLE "Floor" (
    "id" SERIAL NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,
    "floorNumber" INTEGER NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "floorId" INTEGER NOT NULL,
    "roomNumber" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttendence" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,
    "presentDays" JSONB NOT NULL DEFAULT '[]',
    "absentDays" JSONB NOT NULL DEFAULT '[]',
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAttendence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendence_studentId_key" ON "StudentAttendence"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendence_hostelBlockId_key" ON "StudentAttendence"("hostelBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendence_studentId_date_key" ON "StudentAttendence"("studentId", "date");

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendence" ADD CONSTRAINT "StudentAttendence_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendence" ADD CONSTRAINT "StudentAttendence_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
