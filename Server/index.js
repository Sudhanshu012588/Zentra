import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Routes from "./Routes/UserRoutes.js"
import NudgeRoute from "./Routes/NudgeRoutes.js"
import connectDB from './DB/DBconfig.js';
dotenv.config({ path: './.env' });
const app = express();

// CORS config
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true, // allows cookies if needed
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
connectDB()
// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Sudhanshu",
    role: "Manager"
  });
});

app.use("/user",Routes)
app.use("/Nudge",NudgeRoute)

// Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
