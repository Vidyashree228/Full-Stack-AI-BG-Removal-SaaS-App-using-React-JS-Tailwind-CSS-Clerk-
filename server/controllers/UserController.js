import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";

// Clerk webhooks handler
const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData, { new: true });
        res.json({});
        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res.json({});
        break;
      }

      default:
        res.status(400).json({ message: "Unhandled webhook type" });
    }
  } catch (error) {
    console.log("Webhook error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save user from frontend
const saveUserFromFrontend = async (req, res) => {
  try {
    const { clerkId, email, photo, firstName, lastName } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        clerkId,
        email,
        photo,
        firstName,
        lastName,
      });
      console.log("New user created:", user.email);
    } else {
      console.log("User already exists:", email);
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error saving user from frontend:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user credits
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;
    const userData = await userModel.findOne({ clerkId });

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userCredits: userData.creditBalance || 0 });
  } catch (error) {
    console.log("Error getting credits:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Razorpay order creation
const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const clerkId = req.userId;

    // Import Razorpay only when needed
    const Razorpay = (await import("razorpay")).default;

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const userData = await userModel.findOne({ clerkId });

    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid plan" });
    }

    const transactionData = await transactionModel.create({
      clerkId,
      plan,
      amount,
      credits,
      date: Date.now(),
    });

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: transactionData._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.json({ success: false, message: error.message });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log("Error processing payment:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment
const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    // Import Razorpay dynamically again
    const Razorpay = (await import("razorpay")).default;

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(orderInfo.receipt);
      if (transactionData.payment) {
        return res.json({ success: false, message: "Payment already processed" });
      }

      const userData = await userModel.findOne({ clerkId: transactionData.clerkId });
      const creditBalance = userData.creditBalance + transactionData.credits;

      await userModel.findByIdAndUpdate(userData._id, { creditBalance });
      await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

      res.json({ success: true, message: "Credits added" });
    } else {
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.log("Error verifying payment:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  clerkWebhooks,
  saveUserFromFrontend,
  userCredits,
  paymentRazorpay,
  verifyRazorPay
};
