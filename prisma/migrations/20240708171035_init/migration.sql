-- DropForeignKey
ALTER TABLE "InstituteStudent" DROP CONSTRAINT "InstituteStudent_messHallId_fkey";

-- AlterTable
ALTER TABLE "InstituteStudent" ALTER COLUMN "messHallId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE SET NULL ON UPDATE CASCADE;
