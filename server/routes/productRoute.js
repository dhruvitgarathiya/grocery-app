import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
  deleteProduct,
} from "../controllers/productController.js";

const porductRouter = express.Router();

// Debug middleware for product routes
porductRouter.use((req, res, next) => {
  console.log(`Product route hit: ${req.method} ${req.path}`);
  console.log("Product route headers:", req.headers);
  next();
});

porductRouter.post("/add", upload.array("images"), authSeller, addProduct);
porductRouter.get("/list", productList);
porductRouter.get("/id", productById);
porductRouter.post("/stock", authSeller, changeStock);
porductRouter.delete("/delete", authSeller, deleteProduct);

export default porductRouter;
