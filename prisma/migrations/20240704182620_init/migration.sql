/*
  Warnings:

  - You are about to drop the column `cotNo` on the `InstituteStudent` table. All the data in the column will be lost.
  - You are about to drop the column `floorNo` on the `InstituteStudent` table. All the data in the column will be lost.
  - You are about to drop the column `isHosteller` on the `InstituteStudent` table. All the data in the column will be lost.
  - You are about to drop the column `roomNo` on the `InstituteStudent` table. All the data in the column will be lost.
  - You are about to drop the `Security` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Worker` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cotId]` on the table `InstituteStudent` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `floorCount` on the `HostelBlock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `capacity` on the `HostelBlock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `regNo` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rollNo` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pwd` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `community` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.
  - Made the column `aadharNumber` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dob` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bloodGroup` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fatherName` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `motherName` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parentsPhone` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emergencyPhone` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `outingRating` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `disciplineRating` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Community" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST');

-- CreateEnum
CREATE TYPE "CotStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "Security" DROP CONSTRAINT "Security_hostelBlockId_fkey";

-- DropForeignKey
ALTER TABLE "Security" DROP CONSTRAINT "Security_userId_fkey";

-- DropForeignKey
ALTER TABLE "Worker" DROP CONSTRAINT "Worker_userId_fkey";

-- AlterTable
ALTER TABLE "HostelBlock" DROP COLUMN "floorCount",
ADD COLUMN     "floorCount" INTEGER NOT NULL,
DROP COLUMN "capacity",
ADD COLUMN     "capacity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InstituteStudent" DROP COLUMN "cotNo",
DROP COLUMN "floorNo",
DROP COLUMN "isHosteller",
DROP COLUMN "roomNo",
ADD COLUMN     "cotId" INTEGER,
ALTER COLUMN "regNo" SET NOT NULL,
ALTER COLUMN "rollNo" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "pwd" SET NOT NULL,
DROP COLUMN "community",
ADD COLUMN     "community" "Community" NOT NULL,
ALTER COLUMN "aadharNumber" SET NOT NULL,
ALTER COLUMN "dob" SET NOT NULL,
ALTER COLUMN "bloodGroup" SET NOT NULL,
ALTER COLUMN "fatherName" SET NOT NULL,
ALTER COLUMN "motherName" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "parentsPhone" SET NOT NULL,
ALTER COLUMN "emergencyPhone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "outingRating" SET NOT NULL,
ALTER COLUMN "disciplineRating" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "AccountStatus" NOT NULL;

-- DropTable
DROP TABLE "Security";

-- DropTable
DROP TABLE "Worker";

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,
    "roomNumber" VARCHAR(255) NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cot" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "status" "CotStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstituteStudent_cotId_key" ON "InstituteStudent"("cotId");

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_cotId_fkey" FOREIGN KEY ("cotId") REFERENCES "Cot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cot" ADD CONSTRAINT "Cot_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
