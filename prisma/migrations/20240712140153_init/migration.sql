-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ADD COLUMN     "remarks" VARCHAR(255),
ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;
