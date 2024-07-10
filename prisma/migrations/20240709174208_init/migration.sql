/*
  Warnings:

  - You are about to drop the column `HostelFeeReceipt` on the `InstituteStudent` table. All the data in the column will be lost.
  - Added the required column `hostelFeeReceipt` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "HostelFeeReceipt",
ADD COLUMN     "hostelFeeReceipt" VARCHAR(255) NOT NULL;
