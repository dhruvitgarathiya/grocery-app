import React from "react";
import ProductCard from "./ProductCard";
import { useAppcontext } from "../context/AppContext";

const BestSeller = () => {
  const { products, loading } = useAppcontext();

  // Get first 4 products as best sellers
  const bestSellers = products.slice(0, 4);

  if (loading) {
    return (
      <div className="container mx-auto px-4 mt-16">
        <h2 className="text-2xl md:text-3xl font-medium mb-6">Best Sellers</h2>
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Check if no products are available
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 mt-16">
        <h2 className="text-2xl md:text-3xl font-medium mb-6">Best Sellers</h2>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Products Available
          </h3>
          <p className="text-gray-500 max-w-md">
            No products have been added by sellers yet. Check back soon for
            amazing deals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-16">
      <h2 className="text-2xl md:text-3xl font-medium mb-6">Best Sellers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
