/*
  Warnings:

  - You are about to drop the column `securityId` on the `HostelBlock` table. All the data in the column will be lost.
  - You are about to drop the column `warderId` on the `HostelBlock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HostelBlock" DROP COLUMN "securityId",
DROP COLUMN "warderId";
