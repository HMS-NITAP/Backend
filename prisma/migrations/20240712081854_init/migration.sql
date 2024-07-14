-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ADD COLUMN     "returnedOn" TIMESTAMP(3) DEFAULT NULL,
ALTER COLUMN "verifiedOn" SET DEFAULT NULL;
