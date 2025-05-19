import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already registered" });
    }

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error("Register route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // return success with user info
    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
