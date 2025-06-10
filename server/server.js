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

// CORS configuration for deployment
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://grocery-app-1-w432.onrender.com", // Add your deployed frontend URL
  "https://grocery-app-abnm.onrender.com", // Add your backend URL as well
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all render.com subdomains for flexibility
      if (origin && origin.includes("onrender.com")) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
