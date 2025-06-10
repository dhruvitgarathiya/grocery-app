import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

async function testProductList() {
  console.log("Testing Product List Functionality...\n");

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

    // Step 2: Test product listing
    console.log("\n2. Testing product listing...");
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

      if (listData.products && listData.products.length > 0) {
        console.log("\nSample product data:");
        const sampleProduct = listData.products[0];
        console.log({
          id: sampleProduct._id,
          name: sampleProduct.name,
          category: sampleProduct.category,
          price: sampleProduct.price,
          inStock: sampleProduct.inStock,
          createdAt: sampleProduct.createdAt,
          imageCount: sampleProduct.image?.length || 0,
        });
      }
    } else {
      console.log("❌ Failed to fetch products:", listData.message);
    }

    // Step 3: Test stock update (if products exist)
    if (listData.success && listData.products && listData.products.length > 0) {
      console.log("\n3. Testing stock update...");
      const firstProduct = listData.products[0];
      const newStockStatus = !firstProduct.inStock;

      const stockResponse = await fetch(`${API_BASE_URL}/product/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies,
        },
        credentials: "include",
        body: JSON.stringify({
          id: firstProduct._id,
          inStock: newStockStatus,
        }),
      });

      const stockData = await stockResponse.json();
      console.log("Stock update response:", stockData);

      if (stockData.success) {
        console.log(
          `✅ Stock updated successfully to: ${
            newStockStatus ? "In Stock" : "Out of Stock"
          }`
        );
      } else {
        console.log("❌ Failed to update stock:", stockData.message);
      }
    }

    // Step 4: Test product deletion (if products exist)
    if (listData.success && listData.products && listData.products.length > 0) {
      console.log("\n4. Testing product deletion...");
      const lastProduct = listData.products[listData.products.length - 1];

      const deleteResponse = await fetch(`${API_BASE_URL}/product/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies,
        },
        credentials: "include",
        body: JSON.stringify({
          id: lastProduct._id,
        }),
      });

      const deleteData = await deleteResponse.json();
      console.log("Delete response:", deleteData);

      if (deleteData.success) {
        console.log("✅ Product deleted successfully");

        // Verify deletion by fetching the list again
        console.log("\n5. Verifying deletion...");
        const verifyResponse = await fetch(`${API_BASE_URL}/product/list`, {
          method: "GET",
          credentials: "include",
          headers: {
            Cookie: cookies,
          },
        });

        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          const newCount = verifyData.products?.length || 0;
          const originalCount = listData.products?.length || 0;
          console.log(
            `✅ Product count changed from ${originalCount} to ${newCount}`
          );
        }
      } else {
        console.log("❌ Failed to delete product:", deleteData.message);
      }
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testProductList();
