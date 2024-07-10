/*
  Warnings:

  - You are about to drop the column `aadharNumber` on the `InstituteStudent` table. All the data in the column will be lost.
  - Added the required column `aadhaarNumber` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "aadharNumber",
ADD COLUMN     "aadhaarNumber" VARCHAR(255) NOT NULL;
