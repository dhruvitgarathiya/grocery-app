import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    console.log("Auth middleware - headers:", req.headers);

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      console.log(
        "Auth middleware - No token provided in Authorization header"
      );
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware - Token decoded:", tokenDecode);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      console.log("Auth middleware - User authenticated:", req.userId);
      next();
    } else {
      console.log("Auth middleware - Invalid token structure");
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
      });
    }
  } catch (error) {
    console.log("Auth middleware - Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized - Invalid token",
    });
  }
};

export default authUser;
