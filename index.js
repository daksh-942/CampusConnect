import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import custom files using `import`
import connectToMongodb from "./connect.js";
import userRoute from "./routes/user.js";
import questionRoutes from "./routes/question.js";
import answerRoutes from "./routes/answer.js";

// Load environment variables
dotenv.config();

// Create app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/user", userRoute);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
// Connect to MongoDB
connectToMongodb("mongodb://127.0.0.1:27017/shivu")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Start server
app.listen(8000, () => console.log("🚀 Server started on http://localhost:8000"));