//register user : /api/user/register

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required details",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      httpOnly: true, // prevent js to access the cookie
      secure: process.env.NODE_ENV === "production", // enable secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // use none in production for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
      path: "/", // ensure cookie is available for all paths
      // domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined, // set domain for production
    };

    console.log("Setting cookie with options:", cookieOptions);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Request origin:", req.headers.origin);
    console.log("Request host:", req.headers.host);
    console.log("Request referer:", req.headers.referer);
    console.log("Is production:", process.env.NODE_ENV === "production");
    console.log("Cookie secure:", cookieOptions.secure);
    console.log("Cookie sameSite:", cookieOptions.sameSite);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token: token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

//login user : /api/user/login

export const login = async (req, res) => {
  try {
    console.log("Login request received");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch ? "Yes" : "No");

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Token generated:", token.substring(0, 20) + "...");

    const cookieOptions = {
      httpOnly: true, // prevent js to access the cookie
      secure: process.env.NODE_ENV === "production", // enable secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // use none in production for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
      path: "/", // ensure cookie is available for all paths
      // domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined, // set domain for production
    };

    console.log("Setting cookie with options:", cookieOptions);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Request origin:", req.headers.origin);
    console.log("Request host:", req.headers.host);
    console.log("Request referer:", req.headers.referer);
    console.log("Is production:", process.env.NODE_ENV === "production");
    console.log("Cookie secure:", cookieOptions.secure);
    console.log("Cookie sameSite:", cookieOptions.sameSite);

    res.cookie("token", token, cookieOptions);
    console.log("Cookie set successfully");

    const responseData = {
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token: token,
    };

    console.log("Sending response:", responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

//check auth : /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Please login first",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

//logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      // domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
