import React, { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppcontext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const Products = () => {
  const { category } = useParams();
  const {
    filteredProducts,
    loading,
    error,
    searchQuery,
    products,
    handleSearch,
    setFilteredProducts,
  } = useAppcontext();

  // Filter products by category when category param changes
  useEffect(() => {
    if (category) {
      const categoryProducts = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(categoryProducts);
    } else if (!searchQuery) {
      // If no category and no search query, show all products
      setFilteredProducts(products);
    }
  }, [category, products, setFilteredProducts, searchQuery]);

  // Handle search separately
  useEffect(() => {
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase().trim();
      const searchResults = products.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category
          .toLowerCase()
          .includes(searchTerm);
        const descriptionMatch = product.description.some((desc) =>
          desc.toLowerCase().includes(searchTerm)
        );
        return nameMatch || categoryMatch || descriptionMatch;
      });
      setFilteredProducts(searchResults);
    } else if (!category) {
      // If no search query and no category, show all products
      setFilteredProducts(products);
    }
  }, [searchQuery, products, setFilteredProducts, category]);

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

  // Get category title from the URL parameter
  const getCategoryTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (category) {
      // Convert category to title case (e.g., "vegetables" -> "Vegetables")
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    return "All Products";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          {getCategoryTitle()}
        </h1>
        <div className="text-gray-600">
          {searchQuery ? (
            <p>
              Found {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          ) : category ? (
            <p>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} in this
              category
            </p>
          ) : null}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchQuery
              ? `No products found matching "${searchQuery}"`
              : category
              ? `No products available in ${category} category`
              : "No products available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
