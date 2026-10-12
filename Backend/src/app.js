import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,   // deployed frontend
  "http://localhost:5173",    // local frontend
].filter(Boolean);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Root health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "GenAI API Backend is running live!",
  });
});

// Register routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;