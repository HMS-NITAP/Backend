/*
  Warnings:

  - You are about to drop the column `fileContent` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `blockId` on the `HostelBlock` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostelBlockId` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostelBlockId` to the `Official` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostelBlockId` to the `OutingApplication` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `from` on the `OutingApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `to` on the `OutingApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `hostelBlockId` to the `Security` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessSession" AS ENUM ('Breakfast', 'Lunch', 'Snacks', 'Dinner');

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_createdById_fkey";

-- DropForeignKey
ALTER TABLE "HostelBlock" DROP CONSTRAINT "HostelBlock_securityId_fkey";

-- DropIndex
DROP INDEX "HostelBlock_securityId_key";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "fileContent",
ADD COLUMN     "fileUrl" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "HostelBlock" DROP COLUMN "blockId",
ADD COLUMN     "warderId" INTEGER,
ALTER COLUMN "securityId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InstituteStudent" ADD COLUMN     "hostelBlockId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Official" ADD COLUMN     "hostelBlockId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ADD COLUMN     "hostelBlockId" INTEGER NOT NULL,
DROP COLUMN "from",
ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
DROP COLUMN "to",
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Security" ADD COLUMN     "hostelBlockId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MessRatingAndReview" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" VARCHAR(255) NOT NULL,
    "messHallId" INTEGER NOT NULL,
    "session" "MessSession" NOT NULL,

    CONSTRAINT "MessRatingAndReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Official" ADD CONSTRAINT "Official_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Official"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessRatingAndReview" ADD CONSTRAINT "MessRatingAndReview_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutingApplication" ADD CONSTRAINT "OutingApplication_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
