import React, { useEffect } from "react";
import { useAppcontext } from "../context/AppContext";
import { assets } from "../assets/assets";

const MyOrders = () => {
  const {
    user,
    userOrders,
    ordersLoading,
    orderError,
    fetchUserOrders,
    cancelOrder,
  } = useAppcontext();

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user, fetchUserOrders]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "order placed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await cancelOrder(orderId);
    }
  };

  const canCancelOrder = (status) => {
    return status !== "delivered" && status !== "cancelled";
  };

  if (!user) {
    return (
      <div className="mt-10 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-medium">My Orders</h1>
        <div className="mt-6 text-center py-12 bg-gray-900 rounded-lg shadow-md border border-gray-700">
          <p className="text-gray-300 text-lg">
            Please login to view your orders
          </p>
        </div>
      </div>
    );
  }

  if (ordersLoading) {
    return (
      <div className="mt-10 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-medium">My Orders</h1>
        <div className="mt-6 text-center py-12 bg-gray-900 rounded-lg shadow-md border border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF41] mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="mt-10 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-medium">My Orders</h1>
        <div className="mt-6 text-center py-12 bg-gray-900 rounded-lg shadow-md border border-gray-700">
          <p className="text-red-500 text-lg">Error loading orders</p>
          <p className="text-gray-300 mt-2">{orderError}</p>
          <button
            onClick={fetchUserOrders}
            className="mt-4 px-4 py-2 bg-[#00FF41] text-black rounded-md hover:bg-[#00CC33] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-medium">My Orders</h1>

      {userOrders.length === 0 ? (
        <div className="mt-6 text-center py-12 bg-gray-900 rounded-lg shadow-md border border-gray-700">
          <p className="text-gray-300 text-lg">You have no orders yet</p>
          <p className="text-gray-400 mt-2">
            Start shopping to see your orders here
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {userOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 rounded-lg shadow overflow-hidden border border-gray-700"
            >
              {/* Order Header */}
              <div className="bg-gray-800 p-4 border-b border-gray-700">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      Order #{order._id.slice(-6)}
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-300">
                      Paid via {order.paymentType}{" "}
                      {order.isPaid ? "(Paid)" : "(Pending)"}
                    </p>
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-500 hover:border-red-400 rounded transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-200 mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-md overflow-hidden">
                        <img
                          src={item.product?.image?.[0] || assets.box_icon}
                          alt={item.product?.name || "Product"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = assets.box_icon;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {item.product?.name || "Product Name"}
                        </p>
                        <p className="text-sm text-gray-300">
                          Quantity: {item.quantity}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.product?.offerPrice ? (
                            <>
                              <span className="text-[#00FF41] font-medium">
                                ₹{item.product.offerPrice}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-[#00FF41] font-medium">
                              ₹{item.product?.price || 0}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#00FF41]">
                          ₹
                          {(item.product?.offerPrice ||
                            item.product?.price ||
                            0) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white">₹{order.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="font-medium text-white">Total Amount</span>
                    <span className="text-xl font-medium text-[#00FF41]">
                      ₹{order.amount}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                {order.address && (
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-200 mb-2">
                      Delivery Address
                    </h3>
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-white">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p>{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state}{" "}
                        {order.address.zipcode}
                      </p>
                      <p>{order.address.country}</p>
                      <p className="mt-1">{order.address.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
