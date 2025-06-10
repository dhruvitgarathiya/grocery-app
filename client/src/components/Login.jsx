import React, { useState } from "react";
import { useAppcontext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser } = useAppcontext();
  const [state, setState] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

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
      if (state === "register") {
        // Validate registration
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long!");
          return;
        }

        // Register API call
        const response = await fetch(`${API_BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          });
          setShowUserLogin(false);
          toast.success("Registration successful!");
        } else {
          setError(data.message || "Registration failed!");
        }
      } else {
        // Handle login
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields!");
          return;
        }

        // Login API call
        const response = await fetch(`${API_BASE_URL}/user/login`, {
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
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          });
          setShowUserLogin(false);
          toast.success("Login successful!");
        } else {
          setError(data.message || "Login failed!");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const toggleState = (newState) => {
    setState(newState);
    resetForm();
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md mx-4 p-8 bg-white rounded-lg shadow-xl"
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            <span className="text-[#9B7A92]">GreenCart</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {state === "login"
              ? "Welcome back! Please enter your details."
              : "Create your account to get started."}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {state === "register" && (
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B7A92]/20"
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B7A92]/20"
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={
              state === "login"
                ? "Enter your password"
                : "Create a password (min. 6 characters)"
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B7A92]/20"
            required
            minLength={state === "register" ? 6 : undefined}
          />
        </div>

        {state === "register" && (
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B7A92]/20"
              required
              minLength={6}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white bg-[#9B7A92] rounded-md hover:bg-[#7C5A6B] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Loading..."
            : state === "register"
            ? "Create Account"
            : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {state === "register"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              toggleState(state === "register" ? "login" : "register")
            }
            className="text-[#9B7A92] hover:text-[#7C5A6B] font-medium"
          >
            {state === "register" ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
