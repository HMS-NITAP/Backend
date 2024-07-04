-- DropForeignKey
ALTER TABLE "Official" DROP CONSTRAINT "Official_hostelBlockId_fkey";

-- AlterTable
ALTER TABLE "Official" ALTER COLUMN "hostelBlockId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Official" ADD CONSTRAINT "Official_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
