// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Membuat data Dokter
  const dokter1 = await prisma.dokter.create({
    data: {
      name: "Raiqi",
    },
  });

  const dokter2 = await prisma.dokter.create({
    data: {
      name: "Rayi",
    },
  });

  // Membuat jadwal untuk dokter Raiqi
  await prisma.jadwal.createMany({
    data: [
      {
        dokterId: dokter1.id,
        day: "Monday",
        time_start: "08:00",
        time_finish: "10:00",
        quota: 5,
        status: true,
        date: new Date("2022-11-21T00:00:00.000Z"),
      },
      {
        dokterId: dokter1.id,
        day: "Monday",
        time_start: "08:00",
        time_finish: "10:00",
        quota: 5,
        status: true,
        date: new Date("2022-11-28T00:00:00.000Z"),
      },
      {
        dokterId: dokter1.id,
        day: "Monday",
        time_start: "08:00",
        time_finish: "10:00",
        quota: 5,
        status: true,
        date: new Date("2022-12-05T00:00:00.000Z"),
      },
    ],
  });

  // Membuat jadwal untuk dokter Rayi
  await prisma.jadwal.createMany({
    data: [
      {
        dokterId: dokter2.id,
        day: "Tuesday",
        time_start: "09:00",
        time_finish: "11:00",
        quota: 4,
        status: true,
        date: new Date("2022-11-22T00:00:00.000Z"),
      },
      {
        dokterId: dokter2.id,
        day: "Tuesday",
        time_start: "09:00",
        time_finish: "11:00",
        quota: 4,
        status: true,
        date: new Date("2022-11-29T00:00:00.000Z"),
      },
    ],
  });

  console.log("Data seeding completed!");
}

// Jalankan fungsi seeder
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
