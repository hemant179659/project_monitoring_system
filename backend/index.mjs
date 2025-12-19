import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import departmentRoutes from "./src/routes/department.routes.mjs";

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://72.61.242.80',
  credentials: true
}));
app.use(express.json());

// Required for multer + AWS S3
app.use(express.urlencoded({ extended: true }));

app.use("/department", departmentRoutes);

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
