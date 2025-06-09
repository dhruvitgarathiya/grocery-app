import React from "react";
import { useAppcontext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useAppcontext();
  const navigate = useNavigate();

  // Return null if product is undefined or doesn't have required properties
  if (
    !product ||
    !product.image ||
    !Array.isArray(product.image) ||
    product.image.length === 0
  ) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    addToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={product.image[0]}
          alt={product.name || "Product image"}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
        />
        {product.offerPrice < product.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            {Math.round(
              ((product.price - product.offerPrice) / product.price) * 100
            )}
            % OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-1 line-clamp-1">
          {product.name || "Product Name"}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {Array.isArray(product.description)
            ? product.description.join(", ")
            : product.description || "No description available"}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#9B7A92] font-semibold text-lg">
            ₹{product.offerPrice || product.price || 0}
          </span>
          {product.price > product.offerPrice && (
            <span className="text-gray-500 line-through text-sm">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#9B7A92]/10 text-[#9B7A92] hover:bg-[#9B7A92]/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Add to Cart
        </button>

        {/* Stock Status */}
        {!product.inStock && (
          <p className="text-sm text-red-500 mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
