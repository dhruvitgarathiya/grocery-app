import jwt from "jsonwebtoken";

//login seller : api /seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      // Check if JWT_SECRET is available
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Remove cookie setting - we'll use localStorage instead
      console.log(
        "Seller token generated for localStorage:",
        token.substring(0, 20) + "..."
      );

      return res.status(200).json({
        success: true,
        message: "Seller logged in successfully",
        token: token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//seller auth
export const isSellerAuth = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const sellerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!sellerToken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      return res.json({
        success: true,
        message: "Seller authenticated",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid seller token",
      });
    }
  } catch (error) {
    console.error("Seller auth check error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized - Invalid token",
    });
  }
};

//logout

export const sellerLogout = async (req, res) => {
  try {
    // No need to clear cookies since we're using localStorage
    console.log("Seller logged out, token should be removed from localStorage");

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
