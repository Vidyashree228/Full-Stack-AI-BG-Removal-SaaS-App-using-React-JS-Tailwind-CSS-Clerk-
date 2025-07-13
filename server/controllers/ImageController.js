import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/userModel.js";

// POST /api/image/remove-bg
const removeBgImage = async (req, res) => {
  try {
    const { clerkId } = req.body;

    // 1. Validate User
    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.creditBalance === 0) {
      return res.status(403).json({
        success: false,
        message: "No credit balance",
        creditBalance: 0,
      });
    }

    // 2. Validate file
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imagePath = req.file.path;
    const imageFile = fs.createReadStream(imagePath);

    // 3. Prepare form-data for ClipDrop API
    const formData = new FormData();
    formData.append("image_file", imageFile);

    // 4. Make request to ClipDrop API
    const clipDropResponse = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    // 5. Convert binary response to Base64
    const base64Image = Buffer.from(clipDropResponse.data, "binary").toString("base64");
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

    // 6. Deduct credit
    const newCredit = user.creditBalance - 1;
    await userModel.findByIdAndUpdate(user._id, { creditBalance: newCredit });

    // 7. Cleanup temp file
    fs.unlink(imagePath, () => {});

    // 8. Send response
    res.status(200).json({
      success: true,
      message: "Background removed successfully",
      resultImage,
      creditBalance: newCredit,
    });
  } catch (error) {
    console.error(" Error removing background:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { removeBgImage };
