import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppcontext } from "../../context/AppContext";

const Orders = () => {
  const {
    sellerOrders,
    ordersLoading,
    orderError,
    orderStats,
    fetchSellerOrders,
    updateOrderStatus,
  } = useAppcontext();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSellerOrders();
  }, [fetchSellerOrders]);

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

  const handleStatusUpdate = async (orderId, currentStatus, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to update this order status from "${currentStatus}" to "${newStatus}"?`
      )
    ) {
      await updateOrderStatus(orderId, newStatus);
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus.toLowerCase()) {
      case "order placed":
        return "processing";
      case "processing":
        return "delivered";
      default:
        return null;
    }
  };

  const canUpdateStatus = (status) => {
    return status !== "delivered" && status !== "cancelled";
  };

  // Filter orders based on status and search query
  const filteredOrders = sellerOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.address &&
        order.address.firstName &&
        order.address.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  if (ordersLoading) {
    return (
      <div className="flex-1 py-10 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF41]"></div>
        <p className="mt-4 text-gray-300">Loading orders...</p>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="flex-1 py-10 flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg">Error loading orders</p>
        <p className="text-gray-300 mt-2">{orderError}</p>
        <button
          onClick={fetchSellerOrders}
          className="mt-4 px-4 py-2 bg-[#00FF41] text-black rounded-md hover:bg-[#00CC33] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Orders List</h2>
          <p className="text-gray-600">Total Orders: {sellerOrders.length}</p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Total</h3>
            <p className="text-2xl font-bold text-white">{orderStats.total}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Pending</h3>
            <p className="text-2xl font-bold text-purple-600">
              {orderStats.pending}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Processing</h3>
            <p className="text-2xl font-bold text-blue-600">
              {orderStats.processing}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Delivered</h3>
            <p className="text-2xl font-bold text-green-600">
              {orderStats.delivered}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Cancelled</h3>
            <p className="text-2xl font-bold text-red-600">
              {orderStats.cancelled}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20 focus:border-[#00FF41] bg-gray-800 text-white"
            />
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20 focus:border-[#00FF41] bg-gray-800 text-white"
            >
              <option value="all">All Status</option>
              <option value="order placed">Order Placed</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700"
            >
              {/* Order Header */}
              <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={assets.order_icon}
                    alt="Order"
                    className="w-6 h-6"
                  />
                  <span className="font-medium text-white">
                    Order #{order._id.slice(-6)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  {canUpdateStatus(order.status) && (
                    <select
                      onChange={(e) =>
                        handleStatusUpdate(
                          order._id,
                          order.status,
                          e.target.value
                        )
                      }
                      className="px-2 py-1 text-sm border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-[#00FF41] bg-gray-800 text-white"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Update Status
                      </option>
                      {getNextStatus(order.status) && (
                        <option value={getNextStatus(order.status)}>
                          Mark as {getNextStatus(order.status)}
                        </option>
                      )}
                      <option value="cancelled">Cancel Order</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Order Content */}
              <div className="p-4 md:p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Products */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Products</h3>
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-white">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: ₹
                            {item.product.offerPrice || item.product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Delivery Address</h3>
                    {order.address && (
                      <div className="text-sm text-gray-600">
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
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Order Details</h3>
                    <div className="text-sm text-gray-600">
                      <p className="text-sm text-gray-300">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-300">
                        Payment Method: {order.paymentType}
                      </p>
                      <p className="font-medium text-white mt-2">
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
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-gray-900 rounded-lg shadow-md border border-gray-700">
              <img
                src={assets.box_icon}
                alt="No Orders"
                className="w-32 h-32 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-300 text-lg">
                {sellerOrders.length === 0
                  ? "No orders available"
                  : "No orders match your filters"}
              </p>
              <p className="text-gray-400 mt-2">
                {sellerOrders.length === 0
                  ? "Orders will appear here when customers place them"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
