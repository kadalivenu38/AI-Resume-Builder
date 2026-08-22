import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import dbConn from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-resume-builder-web-application.vercel.app",
    ],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

app.use(apiLimiter);

// Ensure MongoDB is connected before API routes execute
app.use(async (req, res, next) => {
  try {
    await dbConn();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Resume Builder API is running",
  });
});

app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

export default app;
