/*
  Warnings:

  - You are about to drop the column `resolveOn` on the `HostelComplaint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HostelComplaint" DROP COLUMN "resolveOn",
ADD COLUMN     "resolvedOn" TIMESTAMP(3) DEFAULT NULL;
