import React, { useEffect, useState } from "react";
import { assets, dummyOrders } from "../../assets/assets";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    // Simulating API call with dummy data
    setOrders(dummyOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Orders List</h2>
          <p className="text-gray-600">Total Orders: {orders.length}</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {/* Order Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={assets.order_icon}
                    alt="Order"
                    className="w-6 h-6"
                  />
                  <span className="font-medium">
                    Order #{order._id.slice(-6)}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Content */}
              <div className="p-4 md:p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Products */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Products</h3>
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: ₹{item.product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">
                      Customer Details
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
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

                  {/* Order Details */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Order Details</h3>
                    <div className="text-sm text-gray-600">
                      <p>
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p>Payment Method: {order.paymentType}</p>
                      <p className="font-medium text-gray-900 mt-2">
                        Total Amount: ₹{order.amount}
                      </p>
                      <p
                        className={`inline-block px-2 py-1 rounded text-sm ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Payment Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <img
                src={assets.box_icon}
                alt="No Orders"
                className="w-32 h-32 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500 text-lg">No orders available</p>
              <p className="text-gray-400 mt-2">
                Orders will appear here when customers place them
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
