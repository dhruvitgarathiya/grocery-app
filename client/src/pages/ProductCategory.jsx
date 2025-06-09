import React, { useEffect, useMemo } from "react";
import { useAppcontext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products, loading, error } = useAppcontext();
  const { category } = useParams();
  const navigate = useNavigate();

  // Find the category details using useMemo to prevent unnecessary recalculations
  const categoryDetails = useMemo(() => {
    if (!category) return null;
    return categories.find(
      (item) => item.path.toLowerCase() === category.toLowerCase()
    );
  }, [category]);

  // Filter products by category using useMemo
  const filteredProducts = useMemo(() => {
    if (!category) return [];
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }, [category, products]);

  // Redirect to products page if category doesn't exist
  useEffect(() => {
    if (!loading && (!category || !categoryDetails)) {
      navigate("/products", { replace: true });
    }
  }, [category, categoryDetails, loading, navigate]);

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
          <p className="text-xl font-medium mb-2">Error loading products</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!category || !categoryDetails) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-semibold text-gray-800">
            {categoryDetails.text}
          </h1>
          <div className="w-16 h-0.5 bg-[#9B7A92] rounded-full mt-2"></div>
        </div>
        <p className="text-gray-600 mt-4">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} in this
          category
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No products available in {categoryDetails.text} category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Category Description */}
      <div className="mt-12 p-6 bg-[#9B7A92]/5 rounded-lg">
        <h2 className="text-xl font-medium text-gray-800 mb-4">
          About {categoryDetails.text}
        </h2>
        <p className="text-gray-600">
          Discover our carefully curated selection of{" "}
          {categoryDetails.text.toLowerCase()}. We offer the finest quality
          products to meet your needs. From fresh produce to premium items, find
          everything you need in this category.
        </p>
      </div>
    </div>
  );
};

export default ProductCategory;
