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
