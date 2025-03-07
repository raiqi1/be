-- CreateTable
CREATE TABLE "Dokter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Dokter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jadwal" (
    "id" SERIAL NOT NULL,
    "dokterId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "time_start" TEXT NOT NULL,
    "time_finish" TEXT NOT NULL,
    "quota" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jadwal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_dokterId_fkey" FOREIGN KEY ("dokterId") REFERENCES "Dokter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
