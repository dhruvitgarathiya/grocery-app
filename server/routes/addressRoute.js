import express from "express";
import {
  addAddress,
  getAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import authUser from "../middlewares/authUser.js";

const addressRouter = express.Router();

// Debug middleware for address routes
addressRouter.use((req, res, next) => {
  console.log(`Address route hit: ${req.method} ${req.path}`);
  next();
});

addressRouter.post("/add", authUser, addAddress);
addressRouter.post("/get", authUser, getAddress);
addressRouter.delete("/delete", authUser, deleteAddress);

export default addressRouter;
