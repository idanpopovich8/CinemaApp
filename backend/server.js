import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserController from "./controllers/UserController.js";
import ScreeningController from "./controllers/ScreeningController.js";
import cors from "cors";
import startReservationCleanup from "./inteval.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
const port = 3000;
startReservationCleanup();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", UserController);
app.use("/screenings", ScreeningController);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
