// server.js

import dotenv from "dotenv";
dotenv.config(); // Load environment variables at the very top

import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import userRoute from "./routes/userRoute.js";
import imageRouter from "./routes/imageRoutes.js";

// Debug check for Razorpay credentials
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRoute);
app.use("/api/image", imageRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
