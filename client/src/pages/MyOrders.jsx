import React from "react";
import { useAppcontext } from "../context/AppContext";
import { dummyOrders } from "../assets/assets";

const MyOrders = () => {
  const { user } = useAppcontext();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-medium">My Orders</h1>
      {!user ? (
        <p className="mt-6 text-gray-500">Please login to view your orders</p>
      ) : dummyOrders.length === 0 ? (
        <p className="mt-6 text-gray-500">You have no orders yet</p>
      ) : (
        <div className="mt-6 space-y-8">
          {dummyOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-medium">Order #{order._id}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      Paid via {order.paymentType}{" "}
                      {order.isPaid ? "(Paid)" : "(Pending)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.zipcode}
                  </p>
                  <p>Phone: {order.address.phone}</p>
                  <p>Email: {order.address.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.product.offerPrice ? (
                            <>
                              <span className="text-[#9B7A92] font-medium">
                                ₹{item.product.offerPrice}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-[#9B7A92] font-medium">
                              ₹{item.product.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#9B7A92]">
                          ₹
                          {(item.product.offerPrice || item.product.price) *
                            item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-xl font-medium text-[#9B7A92]">
                      ₹{order.amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
