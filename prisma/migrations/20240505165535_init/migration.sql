/*
  Warnings:

  - You are about to alter the column `fileContent` on the `Announcement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(255)`.
  - You are about to drop the column `photo` on the `InstituteStudent` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OutingApplicationTpe" AS ENUM ('Local', 'NonLocal');

-- AlterTable
ALTER TABLE "Announcement" ALTER COLUMN "fileContent" SET NOT NULL,
ALTER COLUMN "fileContent" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "photo";
