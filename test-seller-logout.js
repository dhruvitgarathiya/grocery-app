import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

async function testSellerLogout() {
  console.log("Testing Seller Logout Flow...\n");

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

    // Step 3: Logout
    console.log("\n3. Logging out...");
    const logoutResponse = await fetch(`${API_BASE_URL}/seller/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookies,
      },
    });

    const logoutData = await logoutResponse.json();
    console.log("Logout response:", logoutData);

    // Step 4: Verify logout by checking authentication again
    console.log("\n4. Verifying logout...");
    const verifyResponse = await fetch(`${API_BASE_URL}/seller/is-auth`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookies,
      },
    });

    const verifyData = await verifyResponse.json();
    console.log("Verification response:", verifyData);

    if (!verifyData.success) {
      console.log("✅ Logout successful! Seller is no longer authenticated.");
    } else {
      console.log("❌ Logout failed! Seller is still authenticated.");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSellerLogout();
