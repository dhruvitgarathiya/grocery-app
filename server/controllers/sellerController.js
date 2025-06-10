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

      res.cookie("sellerToken", token, {
        httpOnly: true, // prevent js to access the cookie
        secure: process.env.NODE_ENV === "production", // use secure cookie in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        // csrf protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
      });

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
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

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
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

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
