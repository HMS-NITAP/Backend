-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'STUDENT', 'OFFICIAL', 'STAFF', 'WORKER', 'SECURITY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('OneSeater', 'TwoSeater', 'FourSeater');

-- CreateEnum
CREATE TYPE "OutingApplicationType" AS ENUM ('Local', 'NonLocal');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "MessSession" AS ENUM ('Breakfast', 'Lunch', 'Snacks', 'Dinner');

-- CreateEnum
CREATE TYPE "HostelComplaintCategory" AS ENUM ('General', 'FoodIssues', 'Electrical', 'Civil', 'RoomCleaning', 'RestroomCleaning', 'NetworkIssue', 'Indisciplinary', 'Discrimination', 'Harassment', 'DamagetoProperty');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('UNRESOLVED', 'RESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" VARCHAR(255) DEFAULT '',
    "resetPasswordExpiresIn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "otp" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(6),

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstituteStudent" (
    "id" SERIAL NOT NULL,
    "regNo" VARCHAR(255),
    "rollNo" VARCHAR(255),
    "name" VARCHAR(255),
    "year" VARCHAR(255),
    "branch" VARCHAR(255),
    "gender" "Gender",
    "pwd" BOOLEAN,
    "community" VARCHAR(255),
    "aadharNumber" VARCHAR(255),
    "dob" TIMESTAMP(3),
    "bloodGroup" VARCHAR(255),
    "fatherName" VARCHAR(255),
    "motherName" VARCHAR(255),
    "phone" VARCHAR(255),
    "parentsPhone" VARCHAR(255),
    "emergencyPhone" VARCHAR(255),
    "address" VARCHAR(1000),
    "isHosteller" BOOLEAN,
    "outingRating" DECIMAL(65,30),
    "disciplineRating" DECIMAL(65,30),
    "userId" INTEGER NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,
    "cotNo" VARCHAR(255),
    "floorNo" VARCHAR(255),
    "roomNo" VARCHAR(255),
    "messHallId" INTEGER NOT NULL,

    CONSTRAINT "InstituteStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" SERIAL NOT NULL,
    "staffId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "designation" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" SERIAL NOT NULL,
    "securityId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "designation" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Official" (
    "id" SERIAL NOT NULL,
    "empId" VARCHAR(255),
    "name" VARCHAR(255),
    "designation" VARCHAR(255),
    "gender" "Gender",
    "phone" VARCHAR(255),
    "userId" INTEGER NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,

    CONSTRAINT "Official_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelBlock" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "roomType" "RoomType" NOT NULL,
    "gender" "Gender" NOT NULL,
    "floorCount" VARCHAR(255) NOT NULL,
    "capacity" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warderId" INTEGER,
    "securityId" INTEGER,

    CONSTRAINT "HostelBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "textContent" VARCHAR(255) NOT NULL,
    "fileUrl" VARCHAR(255)[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessHall" (
    "id" SERIAL NOT NULL,
    "hallName" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "capacity" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessHall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessRatingAndReview" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messHallId" INTEGER NOT NULL,
    "session" "MessSession" NOT NULL,

    CONSTRAINT "MessRatingAndReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutingApplication" (
    "id" SERIAL NOT NULL,
    "type" "OutingApplicationType" NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "placeOfVisit" VARCHAR(255) NOT NULL,
    "purpose" VARCHAR(255) NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instituteStudentId" INTEGER NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,

    CONSTRAINT "OutingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelComplaint" (
    "id" SERIAL NOT NULL,
    "category" "HostelComplaintCategory" NOT NULL,
    "about" VARCHAR(255) NOT NULL,
    "fileUrl" VARCHAR(255)[],
    "hostelBlockId" INTEGER NOT NULL,
    "status" "ComplaintStatus" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instituteStudentId" INTEGER NOT NULL,

    CONSTRAINT "HostelComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttendence" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "hostelBlockId" INTEGER NOT NULL,
    "presentDays" JSONB NOT NULL DEFAULT '[]',
    "absentDays" JSONB NOT NULL DEFAULT '[]',
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAttendence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteStudent_userId_key" ON "InstituteStudent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteStudent_messHallId_key" ON "InstituteStudent"("messHallId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_userId_key" ON "Worker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_userId_key" ON "Security"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Official_userId_key" ON "Official"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HostelComplaint_hostelBlockId_key" ON "HostelComplaint"("hostelBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendence_studentId_key" ON "StudentAttendence"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendence_hostelBlockId_key" ON "StudentAttendence"("hostelBlockId");

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Official" ADD CONSTRAINT "Official_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Official" ADD CONSTRAINT "Official_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Official"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessRatingAndReview" ADD CONSTRAINT "MessRatingAndReview_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutingApplication" ADD CONSTRAINT "OutingApplication_instituteStudentId_fkey" FOREIGN KEY ("instituteStudentId") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutingApplication" ADD CONSTRAINT "OutingApplication_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelComplaint" ADD CONSTRAINT "HostelComplaint_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelComplaint" ADD CONSTRAINT "HostelComplaint_instituteStudentId_fkey" FOREIGN KEY ("instituteStudentId") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendence" ADD CONSTRAINT "StudentAttendence_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttendence" ADD CONSTRAINT "StudentAttendence_hostelBlockId_fkey" FOREIGN KEY ("hostelBlockId") REFERENCES "HostelBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
