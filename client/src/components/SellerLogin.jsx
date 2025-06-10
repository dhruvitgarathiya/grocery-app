import React, { useState } from "react";
import { useAppcontext } from "../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { setIsSeller, setShowSellerLogin } = useAppcontext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Handle login
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields!");
        setLoading(false);
        return;
      }

      // Login API call
      const response = await fetch(`${API_BASE_URL}/seller/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSeller(true);
        setShowSellerLogin(false);
        toast.success("Seller login successful!");
      } else {
        setError(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Seller auth error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            <span className="text-[#00FF41]">Seller</span> Login
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Access your seller dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              required
              className="border border-gray-600 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              required
              className="border border-gray-600 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00FF41] text-black w-full py-2 rounded-md cursor-pointer hover:bg-[#00CC33] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Contact admin for seller account credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
