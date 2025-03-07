import { Request, Response, RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { redisClient } from "../config/redis";

const prisma = new PrismaClient();

type JadwalQuery = {
  id?: string;
  day?: string;
};

const getRedisCacheKey = (dokterId: number, day: string) => {
  return `jadwal-dokter:${dokterId}:${day}`;
};

const create_jadwal = async (req: Request, res: Response) => {
  try {
    const {
      dokterName,
      day,
      time_start,
      time_finish,
      quota,
      status,
      date_range,
    } = req.body;

    // Validasi input
    if (
      !dokterName ||
      !day ||
      !time_start ||
      !time_finish ||
      !quota ||
      status === undefined ||
      !date_range
    ) {
      res.status(400).json({ message: "Semua field wajib diisi" });
      return;
    }

    const dokter = await prisma.dokter.findFirst({
      where: { name: dokterName },
    });

    if (!dokter) {
      res.status(404).json({ message: "Dokter tidak ditemukan" });
      return;
    }

    const [start_date, end_date] = date_range.split(" s/d ");
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayName = getDayName(currentDate);
      if (dayName.toLowerCase() === day.toLowerCase()) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Menambahkan jadwal dokter ke dalam database
    const createdSchedules = [];
    for (const date of dates) {
      const jadwal = await prisma.jadwal.create({
        data: {
          dokterId: dokter.id,
          day,
          time_start,
          time_finish,
          quota,
          status,
          date: date,
        },
      });
      createdSchedules.push(jadwal);
    }

    res.status(201).json({
      source: "database",
      data: createdSchedules.map((jadwal) => ({
        ...jadwal,
        dokterName: dokter.name,
      })),
      message: "Jadwal berhasil dibuat",
    });
  } catch (error) {
    console.error("Error creating jadwal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const get_jadwal = async (
  req: Request<{}, {}, {}, JadwalQuery>,
  res: Response
) => {
  try {
    const { id, day } = req.query;

    if (!id || !day) {
      res.status(400).json({
        message: "Missing required query parameters 'id' and 'day'",
      });
      return;
    }

    const doctor_id = Number(id);

    const normalizedDay =
      day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    const cacheKey = getRedisCacheKey(doctor_id, normalizedDay);
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("✅ Data from Redis cache");

      const parsedData = JSON.parse(cachedData).map((item: any) => ({
        ...item,
        doctor_id: item.doctor_id,
        doctor_name: item.doctor_name,
      }));

      res.status(200).json({
        source: "redis",
        message: "Berhasil",
        data: parsedData,
      });
      return;
    }

    // Query pakai normalizedDay
    const jadwal = await prisma.jadwal.findMany({
      where: {
        dokterId: doctor_id,
        day: normalizedDay,
      },
    });

    if (!jadwal || jadwal.length === 0) {
      res.status(404).json({ message: "Jadwal tidak ditemukan" });
      return;
    }

    const doctor_name = await getDokterName(doctor_id);

    const responseData = jadwal.map((item) => ({
      id: item.id,
      doctor_id: item.dokterId,
      day: item.day,
      time_start: item.time_start,
      time_finish: item.time_finish,
      quota: item.quota,
      status: item.status,
      date: formatDate(item.date),
      doctor_name,
    }));

    await redisClient.set(cacheKey, JSON.stringify(responseData), {
      EX: 3600,
    });

    console.log("✅ Data fetched from database");

    res.status(200).json({
      source: "database",
      message: "Berhasil",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching jadwal:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Fungsi untuk mendapatkan nama dokter berdasarkan dokterId
const getDokterName = async (dokterId: number) => {
  const dokter = await prisma.dokter.findUnique({
    where: { id: dokterId },
    select: { name: true },
  });
  return dokter ? dokter.name : "Unknown";
};

const getDayName = (date: Date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
};

export { create_jadwal, get_jadwal };
