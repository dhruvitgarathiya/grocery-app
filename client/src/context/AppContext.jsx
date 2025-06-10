import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
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

  // API base URL
  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch products function
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulating API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Initialize products with inStock property
      const productsWithStock = dummyProducts.map((product) => ({
        ...product,
        inStock: true, // Set default inStock value
      }));
      setProducts(productsWithStock);
      setFilteredProducts(productsWithStock);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses from backend
  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/address/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.addresses || []);
      } else {
        console.error("Failed to fetch addresses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Add address to backend
  const addAddress = async (addressData) => {
    if (!user) {
      throw new Error("User not logged in");
    }

    const response = await fetch(`${API_BASE_URL}/address/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        address: addressData,
        userId: user.id,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Refresh addresses after adding
      await fetchAddresses();
      return data;
    } else {
      throw new Error(data.message || "Failed to add address");
    }
  };

  // Remove address from backend
  const removeAddress = async (addressId) => {
    // For now, we'll just remove from local state
    // You can implement backend deletion later
    setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
    if (selectedAddress?._id === addressId) {
      setSelectedAddress(null);
    }
  };

  // Update product stock status
  const updateProductStock = (productId, inStock) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId ? { ...product, inStock } : product
      )
    );
    // Also update filtered products to keep them in sync
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId ? { ...product, inStock } : product
      )
    );
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
  }, []);

  // Fetch addresses when user changes
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const contextValue = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
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
    navigate,
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
