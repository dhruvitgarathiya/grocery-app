//add address

import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    console.log("=== ADD ADDRESS REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Authenticated user ID:", req.userId);
    console.log("Request headers:", req.headers);

    const { address } = req.body;
    const userId = req.userId; // Get user ID from JWT token

    if (!address) {
      console.log("Address data missing");
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!userId) {
      console.log("User ID missing from JWT token");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("Creating address with data:", { ...address, userId });
    const newAddress = await Address.create({ ...address, userId });
    console.log("Address created successfully:", newAddress);

    res.json({
      success: true,
      message: "address added succesfully",
    });
  } catch (error) {
    console.log("Error adding address:", error.message);
    console.log("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get address : api/address/get

export const getAddress = async (req, res) => {
  try {
    console.log("=== GET ADDRESS REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Authenticated user ID:", req.userId);
    console.log("Request headers:", req.headers);

    const userId = req.userId; // Get user ID from JWT token

    if (!userId) {
      console.log("User ID missing from JWT token");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("Finding addresses for user ID:", userId);
    const addresses = await Address.find({ userId });
    console.log("Addresses found:", addresses.length);
    console.log("Addresses:", addresses);

    res.json({ success: true, addresses });
  } catch (error) {
    console.log("Error getting addresses:", error.message);
    console.log("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete address : api/address/delete

export const deleteAddress = async (req, res) => {
  try {
    console.log("=== DELETE ADDRESS REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Authenticated user ID:", req.userId);

    const { addressId } = req.body;
    const userId = req.userId; // Get user ID from JWT token

    if (!addressId) {
      console.log("Address ID missing");
      return res.status(400).json({
        success: false,
        message: "Address ID is required",
      });
    }

    if (!userId) {
      console.log("User ID missing from JWT token");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("Deleting address:", addressId, "for user:", userId);

    // Find and delete the address, ensuring it belongs to the authenticated user
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId: userId,
    });

    if (!deletedAddress) {
      console.log("Address not found or doesn't belong to user");
      return res.status(404).json({
        success: false,
        message: "Address not found or you don't have permission to delete it",
      });
    }

    console.log("Address deleted successfully:", deletedAddress);

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting address:", error.message);
    console.log("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
