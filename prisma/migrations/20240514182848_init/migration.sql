/*
  Warnings:

  - A unique constraint covering the columns `[messHallId]` on the table `InstituteStudent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messHallId` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstituteStudent" ADD COLUMN     "messHallId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InstituteStudent_messHallId_key" ON "InstituteStudent"("messHallId");

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
