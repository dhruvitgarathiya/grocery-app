import React from "react";
import { categories } from "../assets/assets";
import { useAppcontext } from "../context/AppContext";
import { useLocation } from "react-router-dom";

const Categories = () => {
  const { navigate } = useAppcontext();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop().toLowerCase();

  const handleCategoryClick = (categoryPath) => {
    const path = categoryPath.toLowerCase();
    if (currentPath === path) {
      // If already on this category, navigate to all products
      navigate("/products");
    } else {
      navigate(`/products/${path}`);
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center">
        <p className="text-2xl md:text-3xl font-medium">Categories</p>
        {currentPath !== "products" && (
          <button
            onClick={() => navigate("/products")}
            className="text-[#00FF41] hover:text-[#00CC33] transition-colors"
          >
            View All Products
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories.map((category, index) => {
          const isActive = currentPath === category.path.toLowerCase();
          return (
            <div
              key={index}
              className={`group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center transition-all ${
                isActive ? "ring-2 ring-[#00FF41] ring-offset-2" : ""
              }`}
              style={{ backgroundColor: category.bgColor }}
              onClick={() => handleCategoryClick(category.path)}
            >
              <img
                className={`group-hover:scale-105 transition-transform duration-300 max-w-28 ${
                  isActive ? "scale-105" : ""
                }`}
                src={category.image}
                alt={category.text}
              />
              <p
                className={`text-sm font-medium text-black ${
                  isActive ? "text-[#00FF41]" : ""
                }`}
              >
                {category.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
