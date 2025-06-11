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

    console.log("Auth seller middleware - Authorization header:", authHeader);
    console.log(
      "Auth seller middleware - Extracted token:",
      sellerToken ? sellerToken.substring(0, 20) + "..." : "null"
    );

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
    console.log(
      "Auth seller middleware - Expected email:",
      process.env.SELLER_EMAIL
    );
    console.log("Auth seller middleware - Token email:", tokenDecode.email);
    console.log(
      "Auth seller middleware - Email match:",
      tokenDecode.email === process.env.SELLER_EMAIL
    );

    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      req.sellerId = tokenDecode.id;
      console.log(
        "Auth seller middleware - Seller authenticated:",
        req.sellerId
      );
      next();
    } else {
      console.log(
        "Auth seller middleware - Invalid seller token - email mismatch"
      );
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid seller token",
      });
    }
  } catch (error) {
    console.log("Auth seller middleware - Error:", error.message);
    console.log("Auth seller middleware - Error stack:", error.stack);
    return res.status(401).json({
      success: false,
      message: "Not authorized - Invalid token",
    });
  }
};

export default authSeller;
