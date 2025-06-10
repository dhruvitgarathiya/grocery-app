import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AddressManagement from "./pages/AddressManagement";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppcontext } from "./context/AppContext";
import Login from "./components/Login";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import SellerLogin from "./components/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, showSellerLogin, isSeller } = useAppcontext();
  return (
    <div className="text-default min-h-screen text-white bg-black">
      <div>
        {isSellerPath ? null : <Navbar />}
        {showUserLogin ? <Login /> : null}
        {showSellerLogin ? <SellerLogin /> : null}

        <Toaster />
        <div
          className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/addresses" element={<AddressManagement />} />
            <Route
              path="/seller"
              element={isSeller ? <SellerLayout /> : <SellerLogin />}
            >
              <Route index element={isSeller ? <AddProduct /> : null} />
              <Route
                path="product-list"
                element={isSeller ? <ProductList /> : null}
              />
              <Route path="orders" element={isSeller ? <Orders /> : null} />
            </Route>
            <Route
              path="/seller/products"
              element={isSeller ? <SellerLayout /> : <SellerLogin />}
            >
              <Route index element={isSeller ? <ProductList /> : null} />
            </Route>
            <Route
              path="/seller/add-product"
              element={isSeller ? <SellerLayout /> : <SellerLogin />}
            >
              <Route index element={isSeller ? <AddProduct /> : null} />
            </Route>
          </Routes>
        </div>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
