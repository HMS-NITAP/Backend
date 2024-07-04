/*
  Warnings:

  - Added the required column `createdById` to the `MessRatingAndReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessRatingAndReview" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MessRatingAndReview" ADD CONSTRAINT "MessRatingAndReview_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
