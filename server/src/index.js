/* eslint-env node */
/// <reference types="node" />
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";

const app = express();

// middlewares
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

// health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ---- DB + Server boot ----
const { PORT = 5000, MONGODB_URI } = process.env;

async function start() {
  try {
    // Mongo bağlantısı (opsiyonel parametreler ile)
    await mongoose.connect(MONGODB_URI, { dbName: "feynetask" });
    console.log("MongoDB bağlı ✅");

    app.listen(PORT, () => {
      console.log(`API http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Mongo bağlantı hatası:", err.message);
    // Bağlantı olmazsa yine de server'ı ayakta tutmak istersen:
    app.listen(PORT, () => {
      console.log(`(DB yok) API yine de http://localhost:${PORT} üzerinde`);
      console.log("Health endpoint çalışır; DB isteyen uçlar eklenince bağlantı gerekli olacak.");
    });
  }
}

start();
