/*
  Warnings:

  - Added the required column `cotNo` to the `Cot` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `roomNumber` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cot" ADD COLUMN     "cotNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomNumber",
ADD COLUMN     "roomNumber" INTEGER NOT NULL;
