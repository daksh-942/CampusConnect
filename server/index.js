import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Import custom files
import connectToMongodb from "./connect.js";
import userRoute from "./routes/user.js";
import questionRoutes from "./routes/question.js";
import answerRoutes from "./routes/answer.js";
import blogRoutes from "./routes/blogRoutes.js";

// Create app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// CORS: allow frontend in both dev & prod
const allowedOrigins = [
  "http://localhost:5173", // dev
  process.env.FRONTEND_URL  // prod (Vercel URL)
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Routes
app.use("/user", userRoute);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/blogs", blogRoutes);

// MongoDB connection
connectToMongodb(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Health check route (optional, useful for Render)
app.get("/healthz", (req, res) => {
  res.send("ok");
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
