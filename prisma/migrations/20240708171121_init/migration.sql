/*
  Warnings:

  - Made the column `cotId` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InstituteStudent" DROP CONSTRAINT "InstituteStudent_cotId_fkey";

-- AlterTable
ALTER TABLE "InstituteStudent" ALTER COLUMN "cotId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_cotId_fkey" FOREIGN KEY ("cotId") REFERENCES "Cot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
