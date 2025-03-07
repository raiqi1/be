## Persyaratan Sistem

- Nodejs  
- PostgreSQL
- Redis

## Instalasi

### 1. Instalasi Node js
Pastikan NodeJs telah terinstal di sistem Anda

### 2. Menginstal PostgreSQL
Pastikan PostgreSQL telah terinstal dan berjalan di sistem Anda. Jika PostgreSQL belum terinstal, Anda bisa mengunduhnya dari [situs resmi PostgreSQL](https://www.postgresql.org/download/).

## 3. Setup .env
DATABASE_URL="postgresql://test1:12312321ewdwsss@localhost:5432/test?schema=public"
REDIS_URL="redis://localhost:6379"
PORT=5000
JWT_SECRET="123erwegbfgr4r23eqwsAXSCEF4R23EWADS"

### 4. Instalasi Dependensi
jalankan `npm install ` untuk menginisialisasi proyek Node Js 

### 5. Redis Server 
Pastikan Redis Server sudah berjalan sesuai port yg ada di env

### 6. Jalankan Server 
Jalankan Perintah ```bash npm run dev``` 