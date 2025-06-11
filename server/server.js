// Load environment variables with explicit path
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

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
console.log("CLIENT_URL:", process.env.CLIENT_URL || "http://localhost:5173");

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

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Simple CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

// Test authentication endpoint
app.get("/api/test-auth", (req, res) => {
  console.log("Test auth - cookies:", req.cookies);
  console.log("Test auth - headers:", req.headers);
  res.json({
    message: "Test auth endpoint",
    cookies: req.cookies,
    hasToken: !!req.cookies.token,
  });
});

// Test cookie setting endpoint
app.get("/api/test-cookie", (req, res) => {
  console.log("Setting test cookie");
  res.cookie("testCookie", "testValue", {
    httpOnly: false, // make it accessible to JavaScript for testing
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  });
  res.json({
    message: "Test cookie set",
    cookies: req.cookies,
    instruction: "Check browser cookies to see if testCookie is set",
  });
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
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
