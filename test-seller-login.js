// Test script for seller login
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

async function testSellerLogin() {
  console.log("Testing Seller Login Flow...\n");

  try {
    // Step 1: Login as seller
    console.log("1. Logging in as seller...");
    const loginResponse = await fetch(`${API_BASE_URL}/seller/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: "admin@example.com",
        password: "greatstack123",
      }),
    });

    const loginData = await loginResponse.json();
    console.log("Login response:", loginData);

    if (!loginData.success) {
      console.error("Login failed:", loginData.message);
      return;
    }

    // Get cookies from login response
    const cookies = loginResponse.headers.get("set-cookie");
    console.log("Cookies received:", cookies);

    // Step 2: Check if seller is authenticated
    console.log("\n2. Checking seller authentication...");
    const authResponse = await fetch(`${API_BASE_URL}/seller/is-auth`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookies,
      },
    });

    const authData = await authResponse.json();
    console.log("Auth check response:", authData);

    if (authData.success) {
      console.log("✅ Login successful! Seller is authenticated.");
    } else {
      console.log("❌ Login failed! Seller is not authenticated.");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSellerLogin();
