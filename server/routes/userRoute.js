import express from "express";
import {
  clerkWebhooks,
  paymentRazorpay,
  userCredits,
  verifyRazorPay,
} from "../controllers/UserController.js";
import authUser from "../middlewares/auth.js";
import User from "../models/UserModel.js";

const router = express.Router();

// POST: Razorpay payment route (requires auth)
router.post("/pay-razor", authUser, paymentRazorpay);

// POST: Verify Razorpay payment
router.post("/verify-razor", verifyRazorPay);

// POST: Create or find user
router.post("/", async (req, res) => {
  const { clerkId, email, photo, firstName, lastName } = req.body;

  console.log("New user request:", email || "No Email");

  if (!clerkId || !email || !photo) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = new User({ clerkId, email, photo, firstName, lastName });
      await user.save();
      console.log("New user saved:", user.email);
    } else {
      console.log("User already exists:", user.email);
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ success: false, message: "Failed to save user" });
  }
});

// POST: Handle Clerk webhooks
router.post("/webhooks", clerkWebhooks);

// GET: Get user credits (requires auth)
router.get("/credits", authUser, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      credits: user.creditBalance,
    });
  } catch (error) {
    console.error("Failed to fetch credits:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user credits",
    });
  }
});

export default router;
