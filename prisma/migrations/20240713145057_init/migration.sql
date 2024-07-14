-- DropForeignKey
ALTER TABLE "MessRatingAndReview" DROP CONSTRAINT "MessRatingAndReview_messHallId_fkey";

-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "MessRatingAndReview" ALTER COLUMN "messHallId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;

-- AddForeignKey
ALTER TABLE "MessRatingAndReview" ADD CONSTRAINT "MessRatingAndReview_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE SET NULL ON UPDATE CASCADE;
