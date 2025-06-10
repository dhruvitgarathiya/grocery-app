import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

async function testServerConnection() {
  console.log("Testing Server Connection...\n");

  try {
    // Test 1: Basic server health
    console.log("1. Testing basic server health...");
    const healthResponse = await fetch(`${API_BASE_URL.replace("/api", "")}/`);
    const healthData = await healthResponse.json();
    console.log("Health check response:", healthData);

    // Test 2: Product list without authentication
    console.log("\n2. Testing product list without authentication...");
    const listResponse = await fetch(`${API_BASE_URL}/product/list`);
    const listData = await listResponse.json();
    console.log("Product list response:", listData);

    if (listData.success) {
      console.log(
        `✅ Server is working! Found ${listData.products?.length || 0} products`
      );
    } else {
      console.log("❌ Product list failed:", listData.message);
    }

    // Test 3: Check if MongoDB is connected
    console.log("\n3. Testing database connection...");
    if (listData.success !== undefined) {
      console.log("✅ Database connection appears to be working");
    } else {
      console.log("❌ Database connection issue");
    }
  } catch (error) {
    console.error("❌ Server connection failed:", error.message);
    console.log("\nPossible issues:");
    console.log("1. Server is not running");
    console.log("2. Wrong port number");
    console.log("3. CORS issues");
    console.log("4. Network connectivity");
  }
}

testServerConnection();
