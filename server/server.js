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
import { upload } from "./configs/multer.js";

// Debug: Check if environment variables are loaded
console.log("Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
console.log("CLIENT_URL:", process.env.CLIENT_URL || "http://localhost:5173");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("Is Production:", process.env.NODE_ENV === "production");

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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://grocery-app-abnm.onrender.com",
  "https://greencart-frontend.vercel.app",
  "https://greencart-frontend.netlify.app",
  "https://greencart.vercel.app",
  "https://greencart.netlify.app",
  "https://grocery-app-1-w432.onrender.com",
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS request from origin:", origin);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log("Allowing request with no origin");
        return callback(null, true);
      }

      // Allow all subdomains of vercel.app, onrender.com, netlify.app
      if (
        allowedOrigins.includes(origin) ||
        /(\.vercel\.app|\.onrender\.com|\.netlify\.app)$/.test(origin)
      ) {
        console.log("Allowing origin:", origin);
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
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
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
  });
  res.json({
    message: "Test cookie set",
    cookies: req.cookies,
    instruction: "Check browser cookies to see if testCookie is set",
  });
});

// Environment test endpoint
app.get("/api/env-test", (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
    requestOrigin: req.headers.origin,
    requestHost: req.headers.host,
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      "user-agent": req.headers["user-agent"],
    },
  });
});

// Debug endpoint for cookie testing
app.get("/api/debug-cookies", (req, res) => {
  console.log("Debug cookies - Request headers:", req.headers);
  console.log("Debug cookies - Request cookies:", req.cookies);

  // Set a test cookie with all possible configurations
  res.cookie("debugCookie", "testValue", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
  });

  res.json({
    message: "Debug cookie endpoint",
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === "production",
    },
    request: {
      origin: req.headers.origin,
      host: req.headers.host,
      cookies: req.cookies,
    },
    cookieSettings: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
    },
  });
});

// Test POST endpoint for debugging
app.post("/api/test-post", (req, res) => {
  console.log("Test POST endpoint hit");
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  res.json({
    success: true,
    message: "Test POST endpoint working",
    headers: req.headers,
    body: req.body,
  });
});

// Test multipart POST endpoint for debugging
app.post("/api/test-multipart", upload.array("images"), (req, res) => {
  console.log("Test multipart POST endpoint hit");
  console.log("Request headers:", req.headers);
  console.log("Request files:", req.files);
  console.log("Request body:", req.body);
  res.json({
    success: true,
    message: "Test multipart POST endpoint working",
    headers: req.headers,
    files: req.files ? req.files.length : 0,
    body: req.body,
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
