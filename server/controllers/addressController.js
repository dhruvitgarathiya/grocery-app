//add address

import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    console.log("Add address request received:", req.body);
    const { address, userId } = req.body;

    if (!address || !userId) {
      return res.status(400).json({
        success: false,
        message: "Address and userId are required",
      });
    }

    const newAddress = await Address.create({ ...address, userId });
    console.log("Address created successfully:", newAddress);

    res.json({
      success: true,
      message: "address added succesfully",
    });
  } catch (error) {
    console.log("Error adding address:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get address : api/address/get

export const getAddress = async (req, res) => {
  try {
    console.log("Get address request received:", req.body);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const addresses = await Address.find({ userId });
    console.log("Addresses found:", addresses.length);

    res.json({ success: true, addresses });
  } catch (error) {
    console.log("Error getting addresses:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
