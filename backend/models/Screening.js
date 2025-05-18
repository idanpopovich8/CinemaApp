import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "reserved", "taken"],
      default: "available",
    },
    reservedAt: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { _id: false }
);

const screeningSchema = new mongoose.Schema(
  {
    movieTitle: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    seats: [seatSchema],
  },
  { timestamps: true }
);

screeningSchema.pre("save", function (next) {
  this.endTime = new Date(this.startTime.getTime() + 60 * 60 * 1000); // +1 hour

  if (!this.seats || this.seats.length === 0) {
    this.seats = Array.from({ length: 50 }, (_, i) => ({
      seatNumber: i + 1,
      status: "available",
      reservedAt: null,
      user: null,
    }));
  }

  next();
});

export default mongoose.model("Screening", screeningSchema);
