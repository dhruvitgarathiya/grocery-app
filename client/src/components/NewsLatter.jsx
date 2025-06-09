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
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-8">
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
                className={`w-full px-4 py-3 rounded-full border ${
                  status === "error" ? "border-red-500" : "border-[#9B7A92]"
                } focus:outline-none focus:ring-2 focus:ring-[#9B7A92]/20`}
              />
              {status === "error" && (
                <p className="text-red-500 text-sm mt-1 text-left">
                  Please enter a valid email address
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#9B7A92] text-white rounded-full hover:bg-[#7C5A6B] transition duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-600 mt-4">
              Thank you for subscribing to our newsletter!
            </p>
          )}

          <p className="text-sm text-gray-500 mt-6">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsLatter;
