-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('Seater1', 'Seater2', 'Seater4');

-- CreateTable
CREATE TABLE "HostelBlock" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "blockId" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "roomType" "RoomType" NOT NULL,
    "gender" "Gender" NOT NULL,
    "floorCount" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "warderId" INTEGER NOT NULL,
    "securityId" INTEGER NOT NULL,

    CONSTRAINT "HostelBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessHall" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "hallName" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "MessHall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostelBlock_warderId_key" ON "HostelBlock"("warderId");

-- CreateIndex
CREATE UNIQUE INDEX "HostelBlock_securityId_key" ON "HostelBlock"("securityId");

-- AddForeignKey
ALTER TABLE "HostelBlock" ADD CONSTRAINT "HostelBlock_warderId_fkey" FOREIGN KEY ("warderId") REFERENCES "Official"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelBlock" ADD CONSTRAINT "HostelBlock_securityId_fkey" FOREIGN KEY ("securityId") REFERENCES "Security"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
