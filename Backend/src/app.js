const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Root health check route (prevents "Cannot GET /" message)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "GenAI API Backend is running live!"
    });
});

// Register your routes after cookieParser().
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;