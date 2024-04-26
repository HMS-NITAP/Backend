/*
  Warnings:

  - You are about to alter the column `year` on the `InstituteStudent` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `outingRating` on the `InstituteStudent` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `disciplineRating` on the `InstituteStudent` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" ALTER COLUMN "year" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "outingRating" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "disciplineRating" SET DATA TYPE VARCHAR(255);
