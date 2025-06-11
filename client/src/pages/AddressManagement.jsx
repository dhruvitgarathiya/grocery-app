import React, { useState, useEffect } from "react";
import { useAppcontext } from "../context/AppContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AddressManagement = () => {
  const { user, addresses, addAddress, removeAddress, fetchAddresses } =
    useAppcontext();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const API_BASE_URL =
    (import.meta.env.VITE_BACKEND_URL ||
      "https://grocery-app-abnm.onrender.com") + "/api";

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  const testAuth = async () => {
    try {
      console.log("Testing authentication...");
      const response = await fetch(`${API_BASE_URL}/test-auth`, {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Test auth response:", data);
      alert(`Auth test: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("Auth test error:", error);
      alert(`Auth test error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add addresses");
      return;
    }

    console.log("User before adding address:", user);
    console.log("User ID:", user.id);

    setLoading(true);
    try {
      await addAddress(newAddress);
      setNewAddress({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
      });
      setShowForm(false);
      toast.success("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      await removeAddress(addressId);
      toast.success("Address removed successfully!");
    } catch (error) {
      toast.error("Failed to remove address");
    }
  };

  if (!user) {
    return (
      <div className="mt-10 max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Address Management</h1>
          <p className="text-gray-600 mb-6">
            Please login to manage your addresses
          </p>
          <Link
            to="/"
            className="inline-block bg-[#00FF41] text-black px-6 py-2 rounded-md hover:bg-[#00CC33] transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-medium">Address Management</h1>
        <div className="flex gap-2">
          <button
            onClick={testAuth}
            className="text-blue-400 hover:text-blue-300 transition text-sm"
          >
            Test Auth
          </button>
          <Link
            to="/cart"
            className="text-[#00FF41] hover:text-[#00CC33] transition"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>

      {/* Address List */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Your Addresses</h2>
        {addresses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-300 mb-4">No addresses added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#00FF41] text-black px-6 py-2 rounded-md hover:bg-[#00CC33] transition"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address._id || address.id}
                className="bg-white p-4 rounded-lg shadow border"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">
                    {address.firstName} {address.lastName}
                  </h3>
                  <button
                    onClick={() =>
                      handleRemoveAddress(address._id || address.id)
                    }
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zipcode}
                  </p>
                  <p>{address.country}</p>
                  <p>{address.phone}</p>
                  <p>{address.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Address Form */}
      {!showForm ? (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#00FF41] text-black px-6 py-3 rounded-md hover:bg-[#00CC33] transition font-medium"
          >
            + Add New Address
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-6">Add New Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newAddress.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newAddress.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={newAddress.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={newAddress.zipcode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent bg-gray-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#00FF41] text-black py-3 rounded-md hover:bg-[#00CC33] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-md hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
