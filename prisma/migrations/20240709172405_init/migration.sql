/*
  Warnings:

  - You are about to drop the column `feeReceipt` on the `InstituteStudent` table. All the data in the column will be lost.
  - Added the required column `HostelFeeReceipt` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituteFeeReceipt` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "feeReceipt",
ADD COLUMN     "HostelFeeReceipt" VARCHAR(255) NOT NULL,
ADD COLUMN     "instituteFeeReceipt" VARCHAR(255) NOT NULL;
