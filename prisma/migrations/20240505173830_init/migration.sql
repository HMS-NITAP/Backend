/*
  Warnings:

  - The `outingRating` column on the `InstituteStudent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `disciplineRating` column on the `InstituteStudent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "outingRating",
ADD COLUMN     "outingRating" DECIMAL(65,30),
DROP COLUMN "disciplineRating",
ADD COLUMN     "disciplineRating" DECIMAL(65,30);
