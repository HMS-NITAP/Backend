-- DropForeignKey
ALTER TABLE "InstituteStudent" DROP CONSTRAINT "InstituteStudent_hostelBlockId_fkey";

-- AlterTable
ALTER TABLE "HostelComplaint" ALTER COLUMN "resolvedOn" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "InstituteStudent" ALTER COLUMN "rollNo" DROP NOT NULL,
ALTER COLUMN "pwd" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "bloodGroup" DROP NOT NULL,
ALTER COLUMN "fatherName" DROP NOT NULL,
ALTER COLUMN "motherName" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "parentsPhone" DROP NOT NULL,
ALTER COLUMN "emergencyPhone" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "hostelBlockId" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "community" DROP NOT NULL,
ALTER COLUMN "aadhaarNumber" DROP NOT NULL,
ALTER COLUMN "paymentDate" DROP NOT NULL,
ALTER COLUMN "paymentMode" DROP NOT NULL,
ALTER COLUMN "hostelFeeReceipt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OutingApplication" ALTER COLUMN "verifiedOn" SET DEFAULT NULL,
ALTER COLUMN "returnedOn" SET DEFAULT NULL;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
