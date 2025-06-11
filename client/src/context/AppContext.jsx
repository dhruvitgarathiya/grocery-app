import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

// Set base URL for axios - use environment variable or fallback to deployed URL
const backendURL =
  (import.meta.env.VITE_BACKEND_URL ||
    "https://grocery-app-abnm.onrender.com") + "/api";
axios.defaults.baseURL = backendURL;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add axios interceptors right after the configuration
axios.interceptors.request.use(
  (config) => {
    // Add Authorization header with token from localStorage
    const userToken = localStorage.getItem("token");
    const sellerToken = localStorage.getItem("sellerToken");
    const token = userToken || sellerToken;

    console.log(
      "Axios interceptor - User token:",
      userToken ? userToken.substring(0, 20) + "..." : "null"
    );
    console.log(
      "Axios interceptor - Seller token:",
      sellerToken ? sellerToken.substring(0, 20) + "..." : "null"
    );
    console.log(
      "Axios interceptor - Using token:",
      token ? token.substring(0, 20) + "..." : "null"
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request:", config.url, config.headers);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("Response Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("sellerToken");
    }
    return Promise.reject(error);
  }
);

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Order management states
  const [userOrders, setUserOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Check seller authentication on mount
  const checkSellerAuth = useCallback(async () => {
    try {
      // Get seller token from localStorage
      const sellerToken = localStorage.getItem("sellerToken");
      console.log(
        "checkSellerAuth - Seller token from localStorage:",
        sellerToken ? sellerToken.substring(0, 20) + "..." : "null"
      );

      if (sellerToken) {
        // Verify token by making a request to is-auth endpoint
        console.log("checkSellerAuth - Making request to /seller/is-auth");
        const response = await axios.get("/seller/is-auth");
        console.log("checkSellerAuth - Response:", response.data);

        if (response.data.success) {
          setIsSeller(true);
          console.log("checkSellerAuth - Seller authenticated successfully");
          // Don't call fetchSellerOrders here to avoid circular dependency
        } else {
          // Token is invalid, clear localStorage
          console.log("checkSellerAuth - Token invalid, clearing localStorage");
          localStorage.removeItem("sellerToken");
          setIsSeller(false);
        }
      } else {
        console.log("checkSellerAuth - No seller token found");
        setIsSeller(false);
      }
    } catch (error) {
      console.error(
        "checkSellerAuth - Error:",
        error.response?.data || error.message
      );
      // Seller is not authenticated, clear invalid token
      localStorage.removeItem("sellerToken");
      setIsSeller(false);
    }
  }, []);

  // Check user authentication on mount
  const checkUserAuth = useCallback(async () => {
    try {
      console.log("Checking user authentication from localStorage...");

      // Get token from localStorage
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        // Verify token by making a request to is-auth endpoint
        const response = await axios.get("/user/is-auth");

        if (response.data.success) {
          const user = JSON.parse(userData);
          setUser(user);
          console.log("User authenticated from localStorage:", user);
        } else {
          // Token is invalid, clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error.response?.data || error.message
      );
      // Clear invalid data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // User logout function
  const userLogout = useCallback(async () => {
    try {
      // Clear localStorage instead of making API call
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setCartItems({});
      setAddresses([]);
      setSelectedAddress(null);
      setPaymentMethod(null);
      setUserOrders([]);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Clean up local state even if there's an error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setCartItems({});
      setAddresses([]);
      setSelectedAddress(null);
      setPaymentMethod(null);
      setUserOrders([]);
      navigate("/");
    }
  }, [navigate]);

  // Seller logout function
  const sellerLogout = useCallback(async () => {
    try {
      // Clear localStorage instead of making API call
      localStorage.removeItem("sellerToken");

      setIsSeller(false);
      setSellerOrders([]);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Clean up local state even if there's an error
      localStorage.removeItem("sellerToken");
      setIsSeller(false);
      setSellerOrders([]);
      navigate("/");
    }
  }, [navigate]);

  // Fetch user orders
  const fetchUserOrders = useCallback(async () => {
    if (!user) return;

    try {
      setOrdersLoading(true);
      setOrderError(null);

      const response = await axios.get("/order/user");

      if (response.data.success) {
        setUserOrders(response.data.orders || []);
        toast.success("Orders fetched successfully");
      } else {
        setOrderError(response.data.message || "Failed to fetch orders");
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setOrderError("Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  // Fetch seller orders
  const fetchSellerOrders = useCallback(async () => {
    if (!isSeller) return;

    try {
      setOrdersLoading(true);
      setOrderError(null);

      const response = await axios.get("/order/seller");

      if (response.data.success) {
        const orders = response.data.orders || [];
        setSellerOrders(orders);

        // Calculate order statistics
        const stats = {
          total: orders.length,
          pending: orders.filter((order) => order.status === "order placed")
            .length,
          processing: orders.filter((order) => order.status === "processing")
            .length,
          delivered: orders.filter((order) => order.status === "delivered")
            .length,
          cancelled: orders.filter((order) => order.status === "cancelled")
            .length,
        };
        setOrderStats(stats);

        toast.success("Orders fetched successfully");
      } else {
        setOrderError(response.data.message || "Failed to fetch orders");
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      setOrderError("Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setOrdersLoading(false);
    }
  }, [isSeller]);

  // Place order (for users)
  const placeOrder = useCallback(
    async (orderData) => {
      if (!user) {
        toast.error("Please login to place an order");
        return null;
      }

      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return null;
      }

      if (!paymentMethod) {
        toast.error("Please select a payment method");
        return null;
      }

      try {
        setOrdersLoading(true);
        setOrderError(null);

        const orderPayload = {
          items: Object.values(cartItems).map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
          paymentType: "COD", // Only COD payment
        };

        const response = await axios.post("/order/cod", orderPayload);

        if (response.data.success) {
          toast.success("Order placed successfully!");

          // Clear cart and reset form
          setCartItems({});
          setSelectedAddress(null);
          setPaymentMethod(null);

          // Refresh user orders
          await fetchUserOrders();

          // Navigate to orders page
          navigate("/my-orders");

          return response.data;
        } else {
          setOrderError(response.data.message || "Failed to place order");
          toast.error(response.data.message || "Failed to place order");
          return null;
        }
      } catch (error) {
        console.error("Error placing order:", error);
        setOrderError("Failed to place order");
        toast.error("Failed to place order");
        return null;
      } finally {
        setOrdersLoading(false);
      }
    },
    [user, selectedAddress, paymentMethod, cartItems, navigate, fetchUserOrders]
  );

  // Update order status (for sellers)
  const updateOrderStatus = useCallback(
    async (orderId, newStatus) => {
      if (!isSeller) {
        toast.error("Only sellers can update order status");
        return false;
      }

      try {
        setOrdersLoading(true);
        setOrderError(null);

        const response = await axios.put("/order/status", {
          orderId,
          status: newStatus,
        });

        if (response.data.success) {
          toast.success(`Order status updated to ${newStatus}`);

          // Update local state
          setSellerOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            )
          );

          // Update user orders if user is viewing their orders
          setUserOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            )
          );

          // Refresh order statistics
          await fetchSellerOrders();

          return true;
        } else {
          setOrderError(
            response.data.message || "Failed to update order status"
          );
          toast.error(response.data.message || "Failed to update order status");
          return false;
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        setOrderError("Failed to update order status");
        toast.error("Failed to update order status");
        return false;
      } finally {
        setOrdersLoading(false);
      }
    },
    [isSeller, fetchSellerOrders]
  );

  // Cancel order (for users)
  const cancelOrder = useCallback(
    async (orderId) => {
      if (!user) {
        toast.error("Please login to cancel orders");
        return false;
      }

      try {
        setOrdersLoading(true);
        setOrderError(null);

        const response = await axios.put("/order/cancel", {
          orderId,
        });

        if (response.data.success) {
          toast.success("Order cancelled successfully");

          // Update local state
          setUserOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: "cancelled" } : order
            )
          );

          // Refresh orders
          await fetchUserOrders();

          return true;
        } else {
          setOrderError(response.data.message || "Failed to cancel order");
          toast.error(response.data.message || "Failed to cancel order");
          return false;
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        setOrderError("Failed to cancel order");
        toast.error("Failed to cancel order");
        return false;
      } finally {
        setOrdersLoading(false);
      }
    },
    [user, fetchUserOrders]
  );

  // Get order by ID
  const getOrderById = useCallback(
    (orderId) => {
      const allOrders = [...userOrders, ...sellerOrders];
      return allOrders.find((order) => order._id === orderId);
    },
    [userOrders, sellerOrders]
  );

  // Get orders by status
  const getOrdersByStatus = useCallback(
    (status) => {
      if (isSeller) {
        return sellerOrders.filter((order) => order.status === status);
      } else {
        return userOrders.filter((order) => order.status === status);
      }
    },
    [isSeller, sellerOrders, userOrders]
  );

  // Get recent orders
  const getRecentOrders = useCallback(
    (limit = 5) => {
      const orders = isSeller ? sellerOrders : userOrders;
      return orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    },
    [isSeller, sellerOrders, userOrders]
  );

  // Fetch products function - memoized to prevent infinite re-renders
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching products from backend...");
      const response = await axios.get("/product/list");

      if (response.data.success) {
        const backendProducts = response.data.products || [];

        // For seller dashboard, use only backend products
        // For customer view, combine with dummy products
        const productsWithStock = backendProducts.map((product) => ({
          ...product,
          inStock: product.inStock !== undefined ? product.inStock : true,
        }));

        setProducts(productsWithStock);
        setFilteredProducts(productsWithStock);

        console.log("Products fetched successfully:", productsWithStock.length);
      } else {
        console.error("Failed to fetch products:", response.data.message);
        setError(response.data.message || "Failed to fetch products");
        // Set empty array instead of dummy products for seller dashboard
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
      // Set empty array instead of dummy products for seller dashboard
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products for customer view (with dummy products fallback)
  const fetchCustomerProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products from backend
      const response = await axios.get("/product/list");

      if (response.data.success) {
        const backendProducts = response.data.products || [];
        // Combine backend products with dummy products for customer view
        const allProducts = [...dummyProducts, ...backendProducts];
        const productsWithStock = allProducts.map((product) => ({
          ...product,
          inStock: product.inStock !== undefined ? product.inStock : true,
        }));
        setProducts(productsWithStock);
        setFilteredProducts(productsWithStock);
      } else {
        // Fallback to dummy products if backend fails for customer view
        const productsWithStock = dummyProducts.map((product) => ({
          ...product,
          inStock: true,
        }));
        setProducts(productsWithStock);
        setFilteredProducts(productsWithStock);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      // Fallback to dummy products for customer view
      const productsWithStock = dummyProducts.map((product) => ({
        ...product,
        inStock: true,
      }));
      setProducts(productsWithStock);
      setFilteredProducts(productsWithStock);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch addresses from backend
  const fetchAddresses = async () => {
    if (!user) return;

    try {
      console.log("Fetching addresses for user:", user.id);
      console.log("API Base URL:", axios.defaults.baseURL);
      const response = await axios.post("/address/get");

      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      } else {
        console.error("Failed to fetch addresses:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      console.error("Error response:", error.response);
    }
  };

  // Add address to backend
  const addAddress = async (addressData) => {
    if (!user) {
      throw new Error("User not logged in");
    }

    console.log("Adding address for user:", user);
    console.log("User object:", user);
    console.log("User ID:", user.id);
    console.log("API Base URL:", axios.defaults.baseURL);
    console.log("Axios defaults:", {
      baseURL: axios.defaults.baseURL,
      withCredentials: axios.defaults.withCredentials,
      headers: axios.defaults.headers,
    });

    const response = await axios.post("/address/add", {
      address: addressData,
    });

    if (response.data.success) {
      // Refresh addresses after adding
      await fetchAddresses();
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add address");
    }
  };

  // Remove address from backend
  const removeAddress = async (addressId) => {
    if (!user) {
      throw new Error("User not logged in");
    }

    try {
      console.log("Removing address:", addressId);
      const response = await axios.delete("/address/delete", {
        data: { addressId },
      });

      if (response.data.success) {
        // Remove from local state
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        if (selectedAddress?._id === addressId) {
          setSelectedAddress(null);
        }
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to remove address");
      }
    } catch (error) {
      console.error("Error removing address:", error);
      throw error;
    }
  };

  // Update product stock
  const updateProductStock = async (productId, inStock) => {
    try {
      const response = await axios.post("/product/stock", {
        id: productId,
        inStock: inStock,
      });

      if (response.data.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, inStock } : product
          )
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, inStock } : product
          )
        );
        toast.success("Stock updated successfully");
      } else {
        toast.error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  // Search products function
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description.some((desc) =>
        desc.toLowerCase().includes(searchTerm)
      );
      return nameMatch || categoryMatch || descriptionMatch;
    });
    setFilteredProducts(filtered);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevCart) => {
      const newCart = { ...prevCart };
      const itemId = typeof product === "string" ? product : product._id;

      if (newCart[itemId]) {
        newCart[itemId] = {
          ...newCart[itemId],
          quantity: (newCart[itemId].quantity || 1) + quantity,
        };
      } else {
        newCart[itemId] = {
          ...(typeof product === "string" ? { _id: product } : product),
          quantity,
        };
      }
      return newCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[itemId];
      return newCart;
    });
  };

  // Update cart item quantity
  const updateCartItemQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevCart) => ({
      ...prevCart,
      [itemId]: {
        ...prevCart[itemId],
        quantity: quantity,
      },
    }));
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  const selectPaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // Calculate cart amount
  const getCartAmount = () => {
    let total = 0;
    Object.values(cartItems).forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    checkSellerAuth(); // Check seller authentication on mount
    checkUserAuth(); // Check user authentication on mount
  }, [fetchProducts, checkSellerAuth, checkUserAuth]);

  // Fetch addresses when user changes
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Fetch seller orders when seller is authenticated
  useEffect(() => {
    if (isSeller) {
      fetchSellerOrders();
    }
  }, [isSeller, fetchSellerOrders]);

  const contextValue = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    showSellerLogin,
    setShowSellerLogin,
    products,
    setProducts,
    loading,
    error,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    setFilteredProducts,
    handleSearch,
    addresses,
    addAddress,
    removeAddress,
    fetchAddresses,
    selectedAddress,
    selectAddress,
    paymentMethod,
    selectPaymentMethod,
    showAddressForm,
    setShowAddressForm,
    getCartAmount,
    updateProductStock,
    fetchProducts,
    fetchCustomerProducts,
    navigate,
    axios,
    sellerLogout,
    checkSellerAuth,
    userLogout,
    userOrders,
    setUserOrders,
    sellerOrders,
    setSellerOrders,
    ordersLoading,
    setOrdersLoading,
    orderError,
    setOrderError,
    orderStats,
    setOrderStats,
    fetchUserOrders,
    fetchSellerOrders,
    placeOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderById,
    getOrdersByStatus,
    getRecentOrders,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppcontext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppcontext must be used within an AppContextProvider");
  }
  return context;
};
