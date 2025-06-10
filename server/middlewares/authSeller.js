import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      req.sellerId = tokenDecode.id;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized - Invalid token",
    });
  }
};

export default authSeller;
