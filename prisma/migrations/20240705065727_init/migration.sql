/*
  Warnings:

  - Added the required column `feeReceipt` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" ADD COLUMN     "feeReceipt" VARCHAR(255) NOT NULL;
