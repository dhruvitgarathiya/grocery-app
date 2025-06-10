// Load environment variables with explicit path
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import sellerRouter from "./routes/sellerRoute.js";

// Get current file directory

import { connectDB } from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import porductRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Debug: Check if environment variables are loaded
console.log("Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");

const app = express();
const port = process.env.PORT || 4000;

// Database connection
connectDB().catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

await connectCloudinary();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", porductRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
