-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'STUDENT', 'OFFICIAL', 'STAFF', 'WORKER', 'SECURITY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

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
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstituteStudent" (
    "id" SERIAL NOT NULL,
    "regNo" VARCHAR(255) NOT NULL,
    "rollNo" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "branch" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "pwd" BOOLEAN NOT NULL,
    "community" VARCHAR(255) NOT NULL,
    "aadharNumber" VARCHAR(255) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "bloodGroup" VARCHAR(255) NOT NULL,
    "fatherName" VARCHAR(255) NOT NULL,
    "motherName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "parentsPhone" VARCHAR(255) NOT NULL,
    "emergencyPhone" VARCHAR(255) NOT NULL,
    "address" VARCHAR(1000) NOT NULL,
    "photo" VARCHAR(255) NOT NULL,
    "isHosteller" BOOLEAN NOT NULL,
    "outingRating" DECIMAL(65,30) NOT NULL,
    "disciplineRatinig" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,

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

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Official" (
    "id" SERIAL NOT NULL,
    "empId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "designation" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Official_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteStudent_userId_key" ON "InstituteStudent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_userId_key" ON "Worker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_userId_key" ON "Security"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Official_userId_key" ON "Official"("userId");

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Official" ADD CONSTRAINT "Official_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
