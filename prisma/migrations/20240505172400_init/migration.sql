/*
  Warnings:

  - You are about to drop the column `warderId` on the `HostelBlock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HostelBlock" DROP CONSTRAINT "HostelBlock_warderId_fkey";

-- DropIndex
DROP INDEX "HostelBlock_warderId_key";

-- AlterTable
ALTER TABLE "HostelBlock" DROP COLUMN "warderId";
