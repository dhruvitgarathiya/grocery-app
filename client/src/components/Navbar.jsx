import React, { useEffect, useState } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppcontext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const {
    user,
    setUser,
    setShowUserLogin,
    searchQuery,
    handleSearch,
    navigate,
    isSeller,
    setIsSeller,
    setShowSellerLogin,
    sellerLogout,
  } = useAppcontext();

  const logout = async () => {
    setUser(null);
    navigate("/");
  };

  const handleSellerLogout = async () => {
    try {
      await sellerLogout();
      setShowSellerDropdown(false);
    } catch (error) {
      console.error("Seller logout error:", error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".seller-dropdown") &&
        !event.target.closest(".user-dropdown")
      ) {
        setShowSellerDropdown(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery?.trim().length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    handleSearch(value);
    if (value.trim()) {
      navigate("/products");
    }
  };

  return (
    <nav className="bg-black text-white px-6 py-4 shadow-md flex items-center justify-between border-b border-gray-800">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-6 font-medium">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-[#00FF41] transition duration-200 ${
                isActive ? "text-[#00FF41]" : ""
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-[#00FF41] transition duration-200 ${
                isActive ? "text-[#00FF41]" : ""
              }`
            }
          >
            All Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-[#00FF41] transition duration-200 ${
                isActive ? "text-[#00FF41]" : ""
              }`
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Search + Cart + Login */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search groceries..."
            className="w-64 px-3 py-1 rounded-md border border-[#00FF41] text-white bg-black focus:outline-none focus:ring-2 focus:ring-[#00FF41]/20"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer text-[#00FF41] hover:text-[#00CC33] transition"
        >
          <GiShoppingCart className="w-6 h-6" />
        </div>

        {/* Seller Login/Logout */}
        {!isSeller ? (
          <button
            onClick={() => setShowSellerLogin(true)}
            className="cursor-pointer px-6 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-full text-sm"
          >
            Seller Login
          </button>
        ) : (
          <div className="relative seller-dropdown">
            <button
              onClick={() => setShowSellerDropdown(!showSellerDropdown)}
              className="cursor-pointer px-6 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-full text-sm"
            >
              Seller Panel
            </button>
            {showSellerDropdown && (
              <ul className="absolute top-10 right-0 bg-gray-900 shadow-lg border border-gray-700 py-2 w-40 rounded-md text-sm z-50 min-w-max">
                <li
                  onClick={() => {
                    navigate("/seller/orders");
                    setShowSellerDropdown(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-800 cursor-pointer transition-colors flex items-center text-white"
                >
                  📋 Manage Orders
                </li>
                <li
                  onClick={() => {
                    navigate("/seller/products");
                    setShowSellerDropdown(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-800 cursor-pointer transition-colors flex items-center text-white"
                >
                  📦 Manage Products
                </li>
                <li
                  onClick={() => {
                    navigate("/seller/add-product");
                    setShowSellerDropdown(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-800 cursor-pointer transition-colors flex items-center text-white"
                >
                  ➕ Add Product
                </li>
                <li
                  onClick={handleSellerLogout}
                  className="px-3 py-2 hover:bg-gray-800 cursor-pointer text-red-400 transition-colors flex items-center border-t border-gray-700 mt-1 pt-1"
                >
                  🚪 Logout
                </li>
              </ul>
            )}
          </div>
        )}

        {/* User Login/Logout */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-[#00FF41] hover:bg-[#00CC33] transition text-black rounded-full font-semibold"
          >
            Login
          </button>
        ) : (
          <div className="relative user-dropdown">
            <img
              src={assets.profile_icon}
              className="w-10 cursor-pointer"
              alt="profile"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            />
            {showUserDropdown && (
              <ul className="absolute top-10 right-0 bg-gray-900 shadow-lg border border-gray-700 py-2 w-32 rounded-md text-sm z-50 min-w-max">
                <li
                  onClick={() => {
                    navigate("/my-orders");
                    setShowUserDropdown(false);
                  }}
                  className="px-3 py-2 hover:bg-[#00FF41]/10 cursor-pointer transition-colors flex items-center"
                >
                  📋 My orders
                </li>
                <li
                  onClick={() => {
                    navigate("/addresses");
                    setShowUserDropdown(false);
                  }}
                  className="px-3 py-2 hover:bg-[#00FF41]/10 cursor-pointer transition-colors flex items-center"
                >
                  📍 Addresses
                </li>
                <li
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="px-3 py-2 hover:bg-[#00FF41]/10 cursor-pointer transition-colors flex items-center border-t border-gray-800 mt-1 pt-1"
                >
                  🚪 Logout
                </li>
              </ul>
            )}
          </div>
        )}
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="sm:hidden"
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>
        {open && (
          <div
            className={`${
              open ? "flex" : "hidden"
            } absolute top-[60px] left-0 w-full bg-gray-900 shadow-md py-4 flex-col item-start gap-2 px-5 text-sm md:hidden`}
          >
            <NavLink to="/" onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)}>
              All Product
            </NavLink>
            {user && (
              <NavLink to="/my-orders" onClick={() => setOpen(false)}>
                My Orders
              </NavLink>
            )}
            {user && (
              <NavLink to="/addresses" onClick={() => setOpen(false)}>
                Addresses
              </NavLink>
            )}
            {isSeller && (
              <NavLink to="/seller/orders" onClick={() => setOpen(false)}>
                Manage Orders
              </NavLink>
            )}
            {isSeller && (
              <NavLink to="/seller/products" onClick={() => setOpen(false)}>
                Manage Products
              </NavLink>
            )}
            {isSeller && (
              <NavLink to="/seller/add-product" onClick={() => setOpen(false)}>
                Add Product
              </NavLink>
            )}
            <NavLink to="/contact" onClick={() => setOpen(false)}>
              Contact
            </NavLink>

            {/* Seller Login/Logout */}
            {!isSeller ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowSellerLogin(true);
                }}
                className="bg-green-600 text-white border border-green-600 px-6 py-2 rounded-md font-semibold 
            hover:bg-green-700
            transition duration-300 ease-in-out"
              >
                Seller Login
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  handleSellerLogout();
                }}
                className="bg-green-600 text-white border border-green-600 px-6 py-2 rounded-md font-semibold 
            hover:bg-green-700
            transition duration-300 ease-in-out"
              >
                Seller Logout
              </button>
            )}

            {/* User Login/Logout */}
            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="bg-[#00FF41] text-black border border-[#00FF41] px-6 py-2 rounded-md font-semibold 
            hover:bg-[#00CC33]
            transition duration-300 ease-in-out"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="bg-[#00FF41] text-black border border-[#00FF41] px-6 py-2 rounded-md font-semibold 
            hover:bg-[#00CC33]
            transition duration-300 ease-in-out"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
