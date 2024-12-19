-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "InstituteStudent" ADD COLUMN     "amountPaid2" VARCHAR(255),
ADD COLUMN     "paymentDate2" VARCHAR(255),
ADD COLUMN     "paymentMode2" "PaymentMode";

-- AlterTable
ALTER TABLE "OutingApplication" ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;
