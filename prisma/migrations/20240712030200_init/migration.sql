-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ADD COLUMN     "verifiedById" INTEGER,
ADD COLUMN     "verifiedOn" TIMESTAMP(3) DEFAULT NULL;

-- AddForeignKey
ALTER TABLE "OutingApplication" ADD CONSTRAINT "OutingApplication_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Official"("id") ON DELETE SET NULL ON UPDATE CASCADE;
