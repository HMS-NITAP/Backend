-- AlterEnum
ALTER TYPE "AccountStatus" ADD VALUE 'ACTIVE1';

-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "InstituteStudent" ADD COLUMN     "instituteFeeReceipt2" VARCHAR(255);

-- AlterTable
ALTER TABLE "OutingApplication" ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;
