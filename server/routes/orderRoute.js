import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllorders,
  getUserOrders,
  placeOrderCOD,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  testAuth,
} from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRouter = express.Router();

// Test route to check authentication
orderRouter.get("/test-auth", authUser, testAuth);

// User routes (require user authentication)
orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.put("/cancel", authUser, cancelOrder);

// Seller routes (require seller authentication)
orderRouter.get("/seller", authSeller, getAllorders);
orderRouter.put("/status", authSeller, updateOrderStatus);
orderRouter.get("/stats", authSeller, getOrderStats);

export default orderRouter;
