/*
  Warnings:

  - You are about to drop the column `instituteFeeReceipt2` on the `InstituteStudent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "instituteFeeReceipt2",
ADD COLUMN     "hostelFeeReceipt2" VARCHAR(255);

-- AlterTable
ALTER TABLE "OutingApplication" ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;
