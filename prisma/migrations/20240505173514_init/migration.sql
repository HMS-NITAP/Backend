/*
  Warnings:

  - Made the column `userId` on table `InstituteStudent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Official` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InstituteStudent" DROP CONSTRAINT "InstituteStudent_userId_fkey";

-- DropForeignKey
ALTER TABLE "Official" DROP CONSTRAINT "Official_userId_fkey";

-- AlterTable
ALTER TABLE "InstituteStudent" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Official" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "InstituteStudent" ADD CONSTRAINT "InstituteStudent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Official" ADD CONSTRAINT "Official_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
