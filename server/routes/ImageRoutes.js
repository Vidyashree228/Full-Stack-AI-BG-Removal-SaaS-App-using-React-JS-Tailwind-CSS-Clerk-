import express from "express";
import { removeBgImage } from "../controllers/ImageController.js";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/auth.js";

const imageRouter = express.Router();

// Route: POST /api/image/remove-bg
imageRouter.post("/remove-bg", authUser, upload.single("image"), removeBgImage);

export default imageRouter;
