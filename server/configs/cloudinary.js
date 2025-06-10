import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  // Clean up environment variables to remove any whitespace or newlines
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  console.log("Cloudinary configuration:");
  console.log("Cloud name:", cloudName ? "Set" : "Not set");
  console.log("API Key:", apiKey ? "Set" : "Not set");
  console.log("API Secret:", apiSecret ? "Set" : "Not set");

  if (!cloudName || !apiKey || !apiSecret) {
    console.error(
      "Missing Cloudinary configuration. Please check your .env file."
    );
    throw new Error("Missing Cloudinary configuration");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  // Test the configuration
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection successful:", result);
  } catch (error) {
    console.error("Cloudinary connection failed:", error);
    throw error;
  }
};

export default connectCloudinary;
