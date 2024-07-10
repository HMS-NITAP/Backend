/*
  Warnings:

  - You are about to drop the column `hostelBlockId` on the `StudentAttendence` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentAttendence" DROP CONSTRAINT "StudentAttendence_hostelBlockId_fkey";

-- AlterTable
ALTER TABLE "StudentAttendence" DROP COLUMN "hostelBlockId";
