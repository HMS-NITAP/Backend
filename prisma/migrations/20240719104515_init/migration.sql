-- AlterEnum
ALTER TYPE "PaymentMode" ADD VALUE 'NEFT_Educational_Loan';

-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;
