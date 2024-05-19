/*
  Warnings:

  - The `presentDays` column on the `StudentAttendence` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `absentDays` column on the `StudentAttendence` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StudentAttendence" DROP COLUMN "presentDays",
ADD COLUMN     "presentDays" TEXT[],
DROP COLUMN "absentDays",
ADD COLUMN     "absentDays" TEXT[];
