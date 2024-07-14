/*
  Warnings:

  - You are about to drop the column `remarks` on the `OutingApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" DROP COLUMN "remarks",
ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;
