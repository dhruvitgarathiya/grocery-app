import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    console.log("Auth seller middleware - headers:", req.headers);

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const sellerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!sellerToken) {
      console.log(
        "Auth seller middleware - No token provided in Authorization header"
      );
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    console.log("Auth seller middleware - Token decoded:", tokenDecode);

    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      req.sellerId = tokenDecode.id;
      console.log(
        "Auth seller middleware - Seller authenticated:",
        req.sellerId
      );
      next();
    } else {
      console.log("Auth seller middleware - Invalid seller token");
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid seller token",
      });
    }
  } catch (error) {
    console.log("Auth seller middleware - Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized - Invalid token",
    });
  }
};

export default authSeller;
