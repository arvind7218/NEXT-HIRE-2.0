// index.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// ────────────────────────  MIDDLEWARE  ────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ 1. list the origins you trust
const allowedOrigins = [
  "http://localhost:5173",                 // Vite dev server
  "https://next-hire-2-0.onrender.com",   // deployed front‑end
];

// ✅ 2. dynamic CORS check
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);            // allow requests with no origin as well (e.g. Postman)
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ────────────────────────  ROUTES  ────────────────────────
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ────────────────────────  START  ────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
