-- CreateTable
CREATE TABLE "StudentMessRecords" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "messHallId" INTEGER NOT NULL,
    "availed" JSON NOT NULL,

    CONSTRAINT "StudentMessRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentMessRecords_studentId_key" ON "StudentMessRecords"("studentId");

-- AddForeignKey
ALTER TABLE "StudentMessRecords" ADD CONSTRAINT "StudentMessRecords_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "InstituteStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMessRecords" ADD CONSTRAINT "StudentMessRecords_messHallId_fkey" FOREIGN KEY ("messHallId") REFERENCES "MessHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
