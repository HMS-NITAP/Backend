-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Accepted', 'Rejected', 'Pending');

-- CreateTable
CREATE TABLE "OutingApplication" (
    "id" SERIAL NOT NULL,
    "type" "OutingApplicationTpe" NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "placeOfVisit" VARCHAR(255) NOT NULL,
    "purpose" VARCHAR(255) NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "instituteStudentId" INTEGER NOT NULL,

    CONSTRAINT "OutingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutingApplication_instituteStudentId_key" ON "OutingApplication"("instituteStudentId");

-- AddForeignKey
ALTER TABLE "OutingApplication" ADD CONSTRAINT "OutingApplication_instituteStudentId_fkey" FOREIGN KEY ("instituteStudentId") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
