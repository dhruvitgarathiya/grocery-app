import React, { useEffect, useState, useMemo } from "react";
import { useAppcontext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, loading, error, addToCart, navigate } = useAppcontext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Find the product using useMemo to prevent unnecessary recalculations
  const product = useMemo(() => {
    return products.find((item) => item._id === id);
  }, [products, id]);

  // Get related products using useMemo
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (item) => item.category === product.category && item._id !== product._id
      )
      .slice(0, 5);
  }, [products, product]);

  // Set initial thumbnail when product is loaded
  useEffect(() => {
    if (product?.image?.[0]) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  // Handle quantity changes
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate("/cart");
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B7A92]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-medium mb-2">Error loading product</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-800 mb-2">
            Product not found
          </p>
          <Link to="/products" className="text-[#9B7A92] hover:underline">
            Return to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-[#9B7A92]">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#9B7A92]">
          Products
        </Link>
        <span>/</span>
        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="hover:text-[#9B7A92]"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#9B7A92]">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="flex gap-4 md:w-1/2">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {product.image.map((image, index) => (
              <button
                key={index}
                onClick={() => setThumbnail(image)}
                className={`w-20 h-20 border rounded-lg overflow-hidden ${
                  thumbnail === image ? "border-[#9B7A92]" : "border-gray-200"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 border rounded-lg overflow-hidden">
            <img
              src={thumbnail}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={i < (product.rating || 4) ? "#9B7A92" : "#E5E7EB"}
                  className="w-5 h-5"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            <span className="text-sm text-gray-600 ml-2">
              ({product.rating || 4} rating)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-gray-500 line-through">₹{product.price}</p>
            <p className="text-2xl font-semibold text-[#9B7A92]">
              ₹{product.offerPrice}
            </p>
            <p className="text-sm text-gray-500">(inclusive of all taxes)</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-6 bg-[#9B7A92] text-white rounded-md hover:bg-[#8A6A82] transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-6 bg-white border-2 border-[#9B7A92] text-[#9B7A92] rounded-md hover:bg-[#9B7A92]/5 transition"
            >
              Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              About Product
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
