-- CreateEnum
CREATE TYPE "HostelComplaintCategory" AS ENUM ('Plumbing', 'Furniture', 'CleanlinessAndHygiene', 'Network');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('UNRESOLVED', 'RESOLVED');

-- CreateTable
CREATE TABLE "HostelComplaint" (
    "id" SERIAL NOT NULL,
    "category" "HostelComplaintCategory" NOT NULL,
    "about" VARCHAR(255) NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,
    "status" "ComplaintStatus" NOT NULL,
    "instituteStudentId" INTEGER NOT NULL,

    CONSTRAINT "HostelComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostelComplaint_hostelBlockId_key" ON "HostelComplaint"("hostelBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "HostelComplaint_instituteStudentId_key" ON "HostelComplaint"("instituteStudentId");

-- AddForeignKey
ALTER TABLE "HostelComplaint" ADD CONSTRAINT "HostelComplaint_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelComplaint" ADD CONSTRAINT "HostelComplaint_instituteStudentId_fkey" FOREIGN KEY ("instituteStudentId") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
