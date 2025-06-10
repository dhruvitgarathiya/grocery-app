import React, { useState } from "react";

const NewsLatter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "success", "error", or ""

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      return;
    }
    // Here you would typically make an API call to subscribe the user
    // For now, we'll just simulate a successful subscription
    setStatus("success");
    setEmail("");
    // Reset status after 3 seconds
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="bg-gray-900 py-16 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-300 mb-8">
            Stay updated with our latest products, offers, and gardening tips!
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <div className="flex-1 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 rounded-full border bg-gray-800 text-white ${
                  status === "error" ? "border-red-500" : "border-[#00FF41]"
                } focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20`}
              />
              {status === "error" && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  Please enter a valid email address
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#00FF41] text-black rounded-full hover:bg-[#00CC33] transition duration-300 whitespace-nowrap font-semibold"
            >
              Subscribe
            </button>
          </form>

          {status === "success" && (
            <p className="text-[#00FF41] mt-4">
              Thank you for subscribing to our newsletter!
            </p>
          )}

          <p className="text-sm text-gray-400 mt-6">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLatter;
