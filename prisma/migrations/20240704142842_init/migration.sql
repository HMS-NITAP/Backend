/*
  Warnings:

  - Added the required column `branch` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'BIOTECH', 'CHEM', 'MME');

-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "branch",
ADD COLUMN     "branch" "Branch" NOT NULL;
