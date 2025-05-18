import express from "express";
import Screening from "../models/Screening.js";
import mongoose from "mongoose";

const router = express.Router();

// Create new screening
router.post("/", async (req, res) => {
  try {
    const { movieTitle, startTime } = req.body;
    const screening = new Screening({ movieTitle, startTime });
    await screening.save();
    res.status(201).json(screening);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const screenings = await Screening.find();
    res.json(screenings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reserve a seat
router.post("/:screeningId/:seatNumber/reserve", async (req, res) => {
  try {
    const { screeningId, seatNumber } = req.params;
    const userId = req.body.userId; // pass userId in body

    if (!mongoose.Types.ObjectId.isValid(screeningId)) {
      return res.status(400).json({ message: "Invalid screening ID" });
    }

    const screening = await Screening.findById(screeningId);
    if (!screening)
      return res.status(404).json({ message: "Screening not found" });

    const seat = screening.seats.find(
      (s) => s.seatNumber === parseInt(seatNumber)
    );
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    if (seat.status !== "available") {
      return res
        .status(400)
        .json({ message: `Seat is currently ${seat.status}` });
    }

    seat.status = "reserved";
    seat.reservedAt = new Date();
    seat.user = userId;

    await screening.save();
    res.json({ message: "Seat reserved", seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Confirm seat booking (mark as taken)
router.post("/:screeningId/:seatNumber/confirm", async (req, res) => {
  try {
    const { screeningId, seatNumber } = req.params;

    if (!mongoose.Types.ObjectId.isValid(screeningId)) {
      return res.status(400).json({ message: "Invalid screening ID" });
    }

    const screening = await Screening.findById(screeningId);
    if (!screening)
      return res.status(404).json({ message: "Screening not found" });

    const seat = screening.seats.find(
      (s) => s.seatNumber === parseInt(seatNumber)
    );
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    if (seat.status !== "reserved") {
      return res
        .status(400)
        .json({ message: "Seat must be reserved before confirmation" });
    }

    seat.status = "taken";
    await screening.save();

    res.json({ message: "Seat booking confirmed", seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Release a seat (make available again)
router.post("/:screeningId/seats/:seatNumber/release", async (req, res) => {
  try {
    const { screeningId, seatNumber } = req.params;

    if (!mongoose.Types.ObjectId.isValid(screeningId)) {
      return res.status(400).json({ message: "Invalid screening ID" });
    }

    const screening = await Screening.findById(screeningId);
    if (!screening)
      return res.status(404).json({ message: "Screening not found" });

    const seat = screening.seats.find(
      (s) => s.seatNumber === parseInt(seatNumber)
    );
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    seat.status = "available";
    seat.reservedAt = null;
    seat.user = null;

    await screening.save();

    res.json({ message: "Seat released", seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid screening ID" });
    }

    const screening = await Screening.findById(id).populate("seats");

    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    res.json(screening);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
