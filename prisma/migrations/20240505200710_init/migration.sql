/*
  Warnings:

  - The values [Accepted,Rejected,Pending] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `type` on the `OutingApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OutingApplicationType" AS ENUM ('Local', 'NonLocal');

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');
ALTER TABLE "OutingApplication" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "ApplicationStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "OutingApplication" DROP COLUMN "type",
ADD COLUMN     "type" "OutingApplicationType" NOT NULL,
ALTER COLUMN "from" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "to" SET DATA TYPE VARCHAR(255);

-- DropEnum
DROP TYPE "OutingApplicationTpe";
