/*
  Warnings:

  - Added the required column `amountPaid` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentDate` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMode` to the `InstituteStudent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'NEFT', 'UPI', 'OTHER');

-- DropForeignKey
ALTER TABLE "StudentMessRecords" DROP CONSTRAINT "StudentMessRecords_messHallId_fkey";

-- AlterTable
ALTER TABLE "InstituteStudent" ADD COLUMN     "amountPaid" VARCHAR(255) NOT NULL,
ADD COLUMN     "paymentDate" VARCHAR(255) NOT NULL,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL;

-- AlterTable
ALTER TABLE "StudentMessRecords" ALTER COLUMN "messHallId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentMessRecords" ADD CONSTRAINT "StudentMessRecords_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE SET NULL ON UPDATE CASCADE;
