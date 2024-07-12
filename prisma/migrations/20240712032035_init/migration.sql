/*
  Warnings:

  - The values [ACCEPTED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('INPROGRESS', 'REJECTED', 'PENDING', 'COMPLETED');
ALTER TABLE "OutingApplication" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "ApplicationStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ADD COLUMN     "remarks" VARCHAR(255),
ALTER COLUMN "verifiedOn" SET DEFAULT NULL;
