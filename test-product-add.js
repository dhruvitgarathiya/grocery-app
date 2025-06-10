import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

async function testProductAdd() {
  console.log("Testing Product Addition...\n");

  try {
    // Step 1: Login as seller first
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

    // Step 2: Test product addition
    console.log("\n2. Testing product addition...");

    const productData = {
      name: "Test Product",
      description: ["High quality product", "Best in market"],
      category: "vegetables",
      price: 99.99,
      offerPrice: 79.99,
    };

    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));

    // Create a simple test image (you can replace this with an actual image file)
    const testImagePath = "./test-image.txt";
    fs.writeFileSync(testImagePath, "test image content");

    formData.append("images", fs.createReadStream(testImagePath));

    const addProductResponse = await fetch(`${API_BASE_URL}/product/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: cookies,
      },
      body: formData,
    });

    const addProductData = await addProductResponse.json();
    console.log("Add product response:", addProductData);

    if (addProductData.success) {
      console.log("✅ Product added successfully!");

      // Step 3: Test product listing
      console.log("\n3. Testing product listing...");
      const listResponse = await fetch(`${API_BASE_URL}/product/list`, {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: cookies,
        },
      });

      const listData = await listResponse.json();
      console.log("Product list response:", listData);

      if (listData.success) {
        console.log(`✅ Found ${listData.products?.length || 0} products`);
      } else {
        console.log("❌ Failed to fetch products");
      }
    } else {
      console.log("❌ Product addition failed:", addProductData.message);
    }

    // Clean up test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testProductAdd();
