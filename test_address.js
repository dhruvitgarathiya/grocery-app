// Test script for address functionality
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Test data
const testUser = {
  email: "test@example.com",
  password: "password123",
};

const testAddress = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  street: "123 Test Street",
  city: "Test City",
  state: "Test State",
  zipcode: "12345",
  country: "Test Country",
  phone: "1234567890",
};

async function testAddressFunctionality() {
  try {
    console.log("Testing address functionality...");

    // First, let's test if the server is running
    console.log("1. Testing server connection...");
    try {
      const response = await axios.get(`${API_BASE_URL}/test`);
      console.log("Server is running:", response.data);
    } catch (error) {
      console.log("Server test failed:", error.message);
      return;
    }

    // Test user registration/login
    console.log("2. Testing user authentication...");
    let token;
    try {
      const loginResponse = await axios.post(
        `${API_BASE_URL}/user/login`,
        testUser
      );
      if (loginResponse.data.success) {
        token = loginResponse.data.token;
        console.log("User authenticated successfully");
      } else {
        console.log("Login failed, trying registration...");
        const registerResponse = await axios.post(
          `${API_BASE_URL}/user/register`,
          {
            name: "Test User",
            ...testUser,
          }
        );
        if (registerResponse.data.success) {
          token = registerResponse.data.token;
          console.log("User registered successfully");
        } else {
          console.log("Registration failed:", registerResponse.data.message);
          return;
        }
      }
    } catch (error) {
      console.log("Authentication error:", error.message);
      return;
    }

    // Set up axios with token
    const authAxios = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Test adding address
    console.log("3. Testing address addition...");
    try {
      const addResponse = await authAxios.post("/address/add", {
        address: testAddress,
      });
      console.log("Address added successfully:", addResponse.data);
    } catch (error) {
      console.log("Add address error:", error.response?.data || error.message);
    }

    // Test getting addresses
    console.log("4. Testing address retrieval...");
    try {
      const getResponse = await authAxios.post("/address/get");
      console.log("Addresses retrieved successfully:", getResponse.data);
    } catch (error) {
      console.log(
        "Get addresses error:",
        error.response?.data || error.message
      );
    }

    console.log("Address functionality test completed!");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testAddressFunctionality();
