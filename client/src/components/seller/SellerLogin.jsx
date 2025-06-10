import React, { useEffect, useState } from "react";
import { useAppcontext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppcontext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onsubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);

      const response = await axios.post("/seller/login", {
        email,
        password,
      });

      if (response.data.success) {
        setIsSeller(true);
        navigate("/seller");
        toast.success("Seller login successful!");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Seller login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  return (
    !isSeller && (
      <form
        onSubmit={onsubmitHandler}
        className="min-h-screen flex items-center text-sm text-grey-600"
      >
        <div className="flex flex-col gap-5 m-auto items-start p-8 p-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span className="text-[#9B7A92]">Seller</span> Login
          </p>
          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#9B7A92] focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#9B7A92] focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#9B7A92] text-white w-full py-2 rounded-md cursor-pointer hover:bg-[#8A6A82] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    )
  );
};

export default SellerLogin;
