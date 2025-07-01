import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/userRoute.js";
// import imageRouter from "./routes/imagesRoutes.js";


const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());
await connectDB()


app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", useRouter);
// app.use("/api/image", imageRouter);
app.listen(PORT, () => console.log("Server running on port: ", PORT));