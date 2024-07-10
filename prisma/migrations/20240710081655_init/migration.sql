-- AlterTable
ALTER TABLE "HostelComplaint" ADD COLUMN     "resolveOn" TIMESTAMP(3) DEFAULT NULL,
ADD COLUMN     "resolvedById" INTEGER;

-- AddForeignKey
ALTER TABLE "HostelComplaint" ADD CONSTRAINT "HostelComplaint_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "Official"("id") ON DELETE SET NULL ON UPDATE CASCADE;
