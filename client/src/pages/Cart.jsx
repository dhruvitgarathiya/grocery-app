import React, { useEffect, useState } from "react";
import { useAppcontext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    addresses,
    selectedAddress,
    paymentMethod,
    selectAddress,
    selectPaymentMethod,
    getCartAmount,
    products,
    placeOrder,
    ordersLoading,
  } = useAppcontext();

  // Convert cartItems object to array
  const cartItemsArray = Object.values(cartItems).filter(
    (item) => item && item._id
  );
  const total = getCartAmount();

  useEffect(() => {
    if (products.length > 0 && cartItemsArray.length > 0) {
      console.log("Cart items loaded:", cartItemsArray);
    }
  }, [products, cartItemsArray]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    await placeOrder();
  };

  return (
    <div className="mt-10 max-w-6xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-medium">Shopping Cart</h1>
      {cartItemsArray.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="text-gray-300 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-[#00FF41] text-black px-6 py-2 rounded-md hover:bg-[#00CC33] transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-medium mb-4">Cart Items</h2>
            <div className="space-y-4">
              {cartItemsArray.map((item) => {
                const productDetails = products.find(
                  (product) => product._id === item._id
                );

                if (!productDetails) {
                  return null;
                }

                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg shadow-sm border border-gray-700"
                  >
                    <img
                      src={productDetails.image[0]}
                      alt={productDetails.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">
                        {productDetails.name}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {productDetails.category}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 text-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-800 text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00FF41] font-medium mb-2">
                        ₹
                        {(productDetails.offerPrice || productDetails.price) *
                          item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Continue Shopping Button */}
              <div className="mt-4">
                <Link
                  to="/products"
                  className="inline-block bg-gray-800 text-[#00FF41] px-6 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-700 space-y-6">
              {/* Delivery Address Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Delivery Address</h3>
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          selectedAddress?._id === address._id
                            ? "border-[#00FF41] bg-[#00FF41]/5"
                            : "border-gray-600 bg-gray-800"
                        }`}
                        onClick={() => selectAddress(address)}
                      >
                        <p className="font-medium">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-gray-300">
                          {address.street}
                        </p>
                        <p className="text-sm text-gray-300">
                          {address.city}, {address.state} {address.zipcode}
                        </p>
                        <p className="text-sm text-gray-300">{address.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-3">No addresses added</p>
                    <Link
                      to="/addresses"
                      className="inline-block bg-[#00FF41] text-black px-4 py-2 rounded-md hover:bg-[#00CC33] transition text-sm"
                    >
                      Add Address
                    </Link>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "COD"
                        ? "border-[#00FF41] bg-[#00FF41]/5"
                        : "border-gray-600 bg-gray-800 hover:border-gray-500"
                    }`}
                    onClick={() => selectPaymentMethod("COD")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💵</span>
                      <div className="flex-1">
                        <p className="font-medium text-white">COD</p>
                        <p className="text-sm text-gray-300">
                          Cash on Delivery - Pay when you receive your order
                        </p>
                      </div>
                      {paymentMethod === "COD" && (
                        <div className="w-5 h-5 bg-[#00FF41] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-medium text-[#00FF41]">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || !paymentMethod || ordersLoading}
                className={`w-full py-3 rounded-md font-medium transition ${
                  selectedAddress && paymentMethod && !ordersLoading
                    ? "bg-[#00FF41] text-black hover:bg-[#00CC33]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {ordersLoading ? (
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
                    Placing Order...
                  </span>
                ) : !selectedAddress ? (
                  "Select Delivery Address"
                ) : !paymentMethod ? (
                  "Select Payment Method"
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
