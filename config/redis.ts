import { createClient, RedisClientType } from "redis";

// Membuat Redis Client dengan url yang didapat dari environment
export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // URL Redis, bisa disesuaikan
});

// Menangani error pada Redis
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Fungsi untuk melakukan koneksi ke Redis
export const connectRedis = async () => {
  await redisClient.connect();
};
