import React, { useEffect } from "react";
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

  return (
    <div className="mt-10 max-w-6xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-medium">Shopping Cart</h1>
      {cartItemsArray.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-[#9B7A92] text-white px-6 py-2 rounded-md hover:bg-[#8A6A82] transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {cartItemsArray.map((item) => {
              // Find the full product details from products array
              const productDetails = products.find((p) => p._id === item._id);
              if (!productDetails) return null;

              return (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <img
                    src={productDetails.image[0]}
                    alt={productDetails.name}
                    className="w-24 h-24 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{productDetails.name}</h3>
                    <p className="text-[#9B7A92] font-medium">
                      ₹{productDetails.offerPrice || productDetails.price}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateCartItemQuantity(item._id, item.quantity - 1)
                        }
                        className="px-2 py-1 border rounded hover:bg-gray-100 transition"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartItemQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#9B7A92] font-medium mb-2">
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
                className="inline-block bg-gray-100 text-[#9B7A92] px-6 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
              {/* Delivery Address Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Delivery Address</h3>
                  <Link
                    to="/addresses"
                    className="text-[#9B7A92] hover:text-[#8A6A82] text-sm"
                  >
                    Manage Addresses
                  </Link>
                </div>
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id || address.id}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          selectedAddress?._id === address._id ||
                          selectedAddress?.id === address.id
                            ? "border-[#9B7A92] bg-[#9B7A92]/5"
                            : "border-gray-200"
                        }`}
                        onClick={() => selectAddress(address)}
                      >
                        <div>
                          <p className="font-medium">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.zipcode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">No addresses added</p>
                    <Link
                      to="/addresses"
                      className="inline-block bg-[#9B7A92] text-white px-4 py-2 rounded-md hover:bg-[#8A6A82] transition text-sm"
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
                  {["Credit Card", "Debit Card", "UPI", "Net Banking"].map(
                    (method) => (
                      <div
                        key={method}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          paymentMethod === method
                            ? "border-[#9B7A92] bg-[#9B7A92]/5"
                            : "border-gray-200"
                        }`}
                        onClick={() => selectPaymentMethod(method)}
                      >
                        {method}
                      </div>
                    )
                  )}
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
                    <span className="text-xl font-medium text-[#9B7A92]">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className={`w-full py-3 rounded-md font-medium transition ${
                  selectedAddress && paymentMethod
                    ? "bg-[#9B7A92] text-white hover:bg-[#8A6A82]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!selectedAddress || !paymentMethod}
              >
                {!selectedAddress
                  ? "Select Delivery Address"
                  : !paymentMethod
                  ? "Select Payment Method"
                  : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
