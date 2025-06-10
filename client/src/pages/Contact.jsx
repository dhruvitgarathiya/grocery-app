import React from "react";

const Contact = () => {
  return (
    <div className="mt-10">
      <h1 className="text-2xl md:text-3xl font-medium">Contact Us</h1>
      <div className="mt-6 max-w-2xl">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#00FF41] focus:ring-[#00FF41] bg-gray-800 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#00FF41] focus:ring-[#00FF41] bg-gray-800 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#00FF41] focus:ring-[#00FF41] bg-gray-800 text-white"
            />
          </div>
          <button
            type="submit"
            className="bg-[#00FF41] text-black px-4 py-2 rounded-md hover:bg-[#00CC33] transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
