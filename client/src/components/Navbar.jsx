import React, { useEffect } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useAppcontext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    searchQuery,
    handleSearch,
    navigate,
  } = useAppcontext();

  const logout = async () => {
    setUser(null);
    navigate("/");
  };

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
    <nav className="bg-white text-[#333] px-6 py-4 shadow-md flex items-center justify-between">
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
              `hover:text-[#9B7A92] transition duration-200 ${
                isActive ? "text-[#9B7A92]" : ""
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
              `hover:text-[#9B7A92] transition duration-200 ${
                isActive ? "text-[#9B7A92]" : ""
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
              `hover:text-[#9B7A92] transition duration-200 ${
                isActive ? "text-[#9B7A92]" : ""
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
            className="w-64 px-3 py-1 rounded-md border border-[#9B7A92] text-black focus:outline-none focus:ring-2 focus:ring-[#9B7A92]/20"
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
          className="relative cursor-pointer text-[#9B7A92] hover:text-[#7C5A6B] transition"
        >
          <GiShoppingCart className="w-6 h-6" />
        </div>
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-[#9B7A92] hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              className="w-10 cursor-pointer"
              alt="profile"
            />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("/my-orders")}
                className="px-3 py-1.5 hover:bg-[#9B7A92]/10 cursor-pointer"
              >
                My orders
              </li>
              <li
                onClick={logout}
                className="px-3 py-1.5 hover:bg-[#9B7A92]/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
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
            } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col item-start gap-2 px-5 text-s, md:hidden`}
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
            <NavLink to="/contact" onClick={() => setOpen(false)}>
              Contact
            </NavLink>
            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className="bg-[#9B7A92] text-white border border-[#9B7A92] px-6 py-2 rounded-md font-semibold 
            hover:bg-[#7C5A6B]
            transition duration-300 ease-in-out"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="bg-[#9B7A92] text-white border border-[#9B7A92] px-6 py-2 rounded-md font-semibold 
            hover:bg-[#7C5A6B]
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
