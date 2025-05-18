import mongoose from "mongoose";
import Screening from "./models/Screening.js";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Screening.deleteMany();

    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const screening = new Screening({
        movieTitle: `Movie #${i + 1}`,
        startTime: new Date(now.getTime() + i * 2 * 60 * 60 * 1000), // 2-hour gap
      });

      await screening.save(); // triggers pre('save') middleware
      console.log(`Saved screening: ${screening.movieTitle}`);
    }

    console.log("Seeded 7 screenings successfully");
  } catch (error) {
    console.error("Error seeding screenings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seed();
