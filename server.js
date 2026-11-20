
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MovieVerse API is running",
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB before handling database routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Local development server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8888;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}



app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
