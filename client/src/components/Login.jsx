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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL =
    (import.meta.env.VITE_BACKEND_URL ||
      "https://grocery-app-abnm.onrender.com") + "/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (state === "register") {
        // Enhanced validation for registration
        if (!formData.name.trim()) {
          setError("Name is required!");
          setLoading(false);
          return;
        }

        if (!validateEmail(formData.email)) {
          setError("Please enter a valid email address!");
          setLoading(false);
          return;
        }

        if (!validatePassword(formData.password)) {
          setError(
            "Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number!"
          );
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }

        // Register API call
        const response = await fetch(`${API_BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.toLowerCase(),
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          };

          // Store token and user data in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(userData));

          setUser(userData);
          setShowUserLogin(false);
          toast.success("Registration successful! Welcome to GreenCart!");
        } else {
          setError(data.message || "Registration failed!");
        }
      } else {
        // Enhanced validation for login
        if (!formData.email.trim()) {
          setError("Email is required!");
          setLoading(false);
          return;
        }

        if (!formData.password) {
          setError("Password is required!");
          setLoading(false);
          return;
        }

        // Login API call
        console.log("Making login request to:", `${API_BASE_URL}/user/login`);
        const response = await fetch(`${API_BASE_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.toLowerCase(),
            password: formData.password,
          }),
        });

        console.log("Login response status:", response.status);
        console.log("Login response headers:", response.headers);
        console.log("Login response ok:", response.ok);

        const data = await response.json();
        console.log("Login response data:", data);
        console.log("Response cookies:", document.cookie);
        console.log(
          "All cookies:",
          document.cookie.split(";").map((c) => c.trim())
        );

        if (data.success) {
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          };
          console.log("Setting user after login:", userData);

          // Store token and user data in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(userData));

          setUser(userData);
          setShowUserLogin(false);
          toast.success(`Welcome back, ${data.user.name}!`);
        } else {
          setError(data.message || "Login failed!");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("Network error. Please check your connection and try again.");
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
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleState = (newState) => {
    setState(newState);
    resetForm();
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md mx-4 p-8 bg-gray-900 rounded-lg shadow-xl border border-gray-700"
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">
            <span className="text-[#00FF41]">GreenCart</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {state === "login"
              ? "Welcome back! Please enter your details."
              : "Create your account to get started."}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
            {error}
          </div>
        )}

        {state === "register" && (
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20 focus:border-[#00FF41] bg-gray-800 text-white"
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200"
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
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20 focus:border-[#00FF41] bg-gray-800 text-white"
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-200"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder={
                state === "login"
                  ? "Enter your password"
                  : "Create a password (min. 6 characters)"
              }
              className="w-full px-4 py-2 pr-10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20 focus:border-[#00FF41] bg-gray-800 text-white"
              required
              minLength={state === "register" ? 6 : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {state === "register" && (
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-200"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 pr-10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20 focus:border-[#00FF41] bg-gray-800 text-white"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-black bg-[#00FF41] rounded-md hover:bg-[#00CC33] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {state === "register" ? "Creating Account..." : "Signing In..."}
            </span>
          ) : state === "register" ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm text-gray-300">
          {state === "register"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              toggleState(state === "register" ? "login" : "register")
            }
            className="text-[#00FF41] hover:text-[#00CC33] font-medium"
          >
            {state === "register" ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
