/*
  Warnings:

  - You are about to drop the column `disciplineRatinig` on the `InstituteStudent` table. All the data in the column will be lost.
  - Added the required column `disciplineRating` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "disciplineRatinig",
ADD COLUMN     "disciplineRating" TEXT NOT NULL,
ALTER COLUMN "year" SET DATA TYPE TEXT,
ALTER COLUMN "outingRating" SET DATA TYPE TEXT;
