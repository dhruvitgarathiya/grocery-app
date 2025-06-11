import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
//add product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    console.log("Add product request received");
    console.log("Files:", req.files);
    console.log("Body:", req.body);

    // Validate request
    if (!req.body.productData) {
      console.log("Missing productData in request body");
      return res.status(400).json({
        success: false,
        message: "Product data is required",
      });
    }

    if (!req.files || req.files.length === 0) {
      console.log("No files uploaded");
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    console.log("Parsing product data...");
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
      console.log("Product data parsed successfully:", productData);
    } catch (parseError) {
      console.error("Error parsing product data:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid product data format",
      });
    }

    const images = req.files;
    console.log("Number of images to upload:", images.length);

    // Upload images to Cloudinary
    console.log("Starting Cloudinary upload...");
    let imagesUrl = [];
    try {
      imagesUrl = await Promise.all(
        images.map(async (item, index) => {
          try {
            console.log(`Uploading image ${index + 1}:`, item.originalname);

            // Convert buffer to base64 for Cloudinary upload
            const base64Image = `data:${
              item.mimetype
            };base64,${item.buffer.toString("base64")}`;

            let result = await cloudinary.uploader.upload(base64Image, {
              resource_type: "image",
            });
            console.log(
              `Image ${index + 1} uploaded successfully:`,
              result.secure_url
            );
            return result.secure_url;
          } catch (uploadError) {
            console.error(`Error uploading image ${index + 1}:`, uploadError);
            throw new Error(
              `Failed to upload image ${index + 1}: ${uploadError.message}`
            );
          }
        })
      );
      console.log("All images uploaded successfully:", imagesUrl);
    } catch (uploadError) {
      console.error("Error during image upload:", uploadError);
      return res.status(500).json({
        success: false,
        message: `Image upload failed: ${uploadError.message}`,
      });
    }

    // Create product in database
    console.log("Creating product in database...");
    try {
      const newProduct = await Product.create({
        ...productData,
        image: imagesUrl,
        inStock: true, // Set default stock status
      });

      console.log("Product created successfully:", newProduct._id);

      res.json({
        success: true,
        message: "Product added successfully",
        productId: newProduct._id,
      });
    } catch (dbError) {
      console.error("Error creating product in database:", dbError);
      return res.status(500).json({
        success: false,
        message: `Database error: ${dbError.message}`,
      });
    }
  } catch (error) {
    console.error("Unexpected error in addProduct:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add product",
    });
  }
};
//get product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error in productList:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

//get single product : /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error in productById:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};

//change product inStock : api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Stock updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in changeStock:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update stock",
    });
  }
};

//delete product : api/product/delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // TODO: Delete images from Cloudinary as well
    console.log("Product deleted successfully:", id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};
