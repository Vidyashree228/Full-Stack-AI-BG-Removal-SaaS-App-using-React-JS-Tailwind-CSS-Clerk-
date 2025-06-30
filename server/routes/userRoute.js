import express from "express";
import  { clerkWebhooks}  from "../controllers/UserController.js";
//

// {
//   paymentRazorpay,
//   userCredits,
//   verifyRazorPay,
// }
// import authUser from "../middlewares/auth.js";

const useRouter = express.Router();

useRouter.post("/webhooks", clerkWebhooks);
// useRouter.get("/credits", authUser, userCredits);
// useRouter.post("/pay-razor", authUser, paymentRazorpay);
// useRouter.post("/verify-razor", verifyRazorPay);

export default useRouter;