/*
  Warnings:

  - The `warderId` column on the `HostelBlock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `securityId` column on the `HostelBlock` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "HostelBlock" DROP COLUMN "warderId",
ADD COLUMN     "warderId" INTEGER[],
DROP COLUMN "securityId",
ADD COLUMN     "securityId" INTEGER[];
