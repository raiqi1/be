import express, { Request, Response } from "express";
import "dotenv/config";
import routes from "./routes/routes";
import { connectRedis } from "./config/redis";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Redis Cache API");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();
    console.log("✅ Redis Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
