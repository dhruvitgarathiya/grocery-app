//place order cod : /api/order/cod

import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address, paymentType } = req.body;
    const userId = req.userId; // Get userId from authenticated user

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!address || items.length === 0) {
      return res.json({
        success: false,
        message: "invalid data",
      });
    }

    // Calculate amount using items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += (product.offerPrice || product.price) * item.quantity;
      }
    }

    // Add tax charge (2%)
    amount += Math.floor(amount * 0.02);

    const orderData = {
      userId, // No need to convert to string, schema accepts ObjectId
      items,
      amount,
      address,
      paymentType: "COD", // Only COD payment
      isPaid: false, // COD orders are not paid initially
    };

    const order = await Order.create(orderData);

    return res.json({
      success: true,
      message: "order placed successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

// Test function to check authentication
export const testAuth = async (req, res) => {
  try {
    console.log("testAuth: req.userId =", req.userId);
    console.log("testAuth: req.userId type =", typeof req.userId);

    return res.json({
      success: true,
      userId: req.userId,
      userIdType: typeof req.userId,
      userIdString: req.userId?.toString(),
    });
  } catch (error) {
    console.error("Test auth error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get oder byuser id : /api/order/user

export const getAllorders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//get all orders for (seller /admin )

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from authenticated user

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const orders = await Order.find({
      userId, // No need to convert to string, schema accepts ObjectId
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user orders",
    });
  }
};

// Update order status (for sellers)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    // Validate status
    const validStatuses = [
      "order placed",
      "processing",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be one of: order placed, processing, delivered, cancelled",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Populate the updated order
    const updatedOrder = await Order.findById(orderId).populate(
      "items.product address"
    );

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

// Cancel order (for users)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId; // Get userId from authenticated user

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    // Check if order can be cancelled (not delivered or already cancelled)
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    // Update order status to cancelled
    order.status = "cancelled";
    await order.save();

    // Populate the updated order
    const updatedOrder = await Order.findById(orderId).populate(
      "items.product address"
    );

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
};

// Get order statistics (for sellers)
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      status: "order placed",
    });
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    const stats = {
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    };

    return res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error getting order stats:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get order statistics",
    });
  }
};
