-- DropForeignKey
ALTER TABLE "InstituteStudent" DROP CONSTRAINT "InstituteStudent_cotId_fkey";

-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "InstituteStudent" ALTER COLUMN "cotId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_cotId_fkey" FOREIGN KEY ("cotId") REFERENCES "Cot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
