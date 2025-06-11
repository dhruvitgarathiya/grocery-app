import React, { useEffect, useState, useCallback } from "react";
import { useAppcontext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, updateProductStock, fetchProducts, loading, axios, error } =
    useAppcontext();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [localLoading, setLocalLoading] = useState(false);

  // Memoize fetchProducts to prevent infinite re-renders
  const loadProducts = useCallback(async () => {
    try {
      setLocalLoading(true);
      console.log("Fetching products...");
      await fetchProducts();
      console.log("Products fetched successfully");
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLocalLoading(false);
    }
  }, [fetchProducts]);

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(product.description)
        ? product.description.some((desc) =>
            desc.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()));

    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.inStock) ||
      (stockFilter === "outOfStock" && !product.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "name":
        return a.name.localeCompare(b.name);
      case "priceHigh":
        return b.price - a.price;
      case "priceLow":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Get unique categories for filter
  const categories = [...new Set(products.map((product) => product.category))];

  // Toggle in-stock status
  const toggleInStock = async (productId, currentStatus) => {
    try {
      await updateProductStock(productId, !currentStatus);
    } catch (error) {
      toast.error("Failed to update stock status");
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        const response = await axios.delete("/product/delete", {
          data: { id: productId },
        });

        if (response.data.success) {
          toast.success("Product deleted successfully");
          // Refresh the product list
          await loadProducts();
        } else {
          toast.error(response.data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };

  // Edit product
  const handleEdit = (productId) => {
    // For now, just show a toast message
    // You can implement navigation to an edit page or open a modal
    toast.success(
      `Edit functionality for product ${productId.slice(
        -8
      )} will be implemented soon!`
    );
    console.log("Edit product:", productId);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await loadProducts();
      toast.success("Products refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh products");
    }
  };

  // Show loading only if both global and local loading are true
  const isLoading = loading || localLoading;

  // Debug information
  console.log("ProductList Debug:", {
    productsLength: products.length,
    loading,
    localLoading,
    isLoading,
    error: error,
  });

  if (isLoading) {
    return (
      <div className="flex-1 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF41] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
          <p className="text-sm text-gray-400 mt-2">
            Please wait while we fetch your products
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex-1 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Error Loading Products
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[#9B7A92] text-white rounded-md hover:bg-[#8A6A82] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Product List</h2>
            <p className="text-gray-600 mt-1">
              Total Products: {products.length} | Showing:{" "}
              {currentProducts.length} of {sortedProducts.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-[#9B7A92] text-white rounded-md hover:bg-[#8A6A82] transition flex items-center gap-2 disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] bg-gray-800 text-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] bg-gray-800 text-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] bg-gray-800 text-white"
              >
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF41] bg-gray-800 text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="priceHigh">Price High to Low</option>
                <option value="priceLow">Price Low to High</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setStockFilter("all");
                  setSortBy("newest");
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Stock Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <img
                            className="h-16 w-16 object-contain rounded border"
                            src={product.image?.[0] || "/placeholder-image.jpg"}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-300 line-clamp-2 max-w-xs">
                            {Array.isArray(product.description)
                              ? product.description.join(", ")
                              : product.description || "No description"}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {product._id?.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        ₹{product.price?.toFixed(2)}
                      </div>
                      {product.offerPrice &&
                        product.offerPrice < product.price && (
                          <div className="text-sm text-[#00FF41]">
                            Offer: ₹{product.offerPrice?.toFixed(2)}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.inStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-[#00FF41]">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-400">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* InStock Toggle Button */}
                        <button
                          onClick={() =>
                            toggleInStock(product._id, product.inStock)
                          }
                          className={`px-3 py-1 rounded-md transition ${
                            product.inStock
                              ? "text-green-400 hover:text-green-300 hover:bg-green-900/20"
                              : "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          }`}
                          title={
                            product.inStock
                              ? "Mark as Out of Stock"
                              : "Mark as In Stock"
                          }
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded-md hover:bg-blue-900/20 transition"
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-400 hover:text-red-300 px-3 py-1 rounded-md hover:bg-red-900/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstProduct + 1} to{" "}
              {Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
              {sortedProducts.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === page
                        ? "bg-[#9B7A92] text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {currentProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
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
            <p className="text-gray-300 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || categoryFilter || stockFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "Add your first product to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
