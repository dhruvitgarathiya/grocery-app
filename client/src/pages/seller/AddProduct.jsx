import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppcontext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const { axios } = useAppcontext();

  const onsubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);

      // Debug: Check seller authentication
      const sellerToken = localStorage.getItem("sellerToken");
      console.log(
        "AddProduct - Seller token:",
        sellerToken ? sellerToken.substring(0, 20) + "..." : "null"
      );
      console.log("AddProduct - Making request to /product/add");

      // Validate required fields
      if (!name || !description || !category || !price || !offerPrice) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate that at least one image is selected
      const validFiles = files.filter((file) => file);
      if (validFiles.length === 0) {
        toast.error("Please select at least one product image");
        return;
      }

      const productData = {
        name,
        description: description
          .split("\n")
          .filter((line) => line.trim() !== ""),
        category,
        price: parseFloat(price),
        offerPrice: parseFloat(offerPrice),
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      // Add only valid files to formData
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          formData.append("images", files[i]);
        }
      }

      console.log("AddProduct - FormData prepared, making request...");
      const { data } = await axios.post("/product/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("AddProduct - Response received:", data);

      if (data.success) {
        toast.success("Product added successfully!");
        // Reset form
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("AddProduct - Error adding product:", error);
      console.error("AddProduct - Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-content">
      <form
        onSubmit={onsubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
          <div>
            <p className="text-base font-medium text-white">Product Image</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label key={index} htmlFor={`image${index}`}>
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      accept="image/*"
                      type="file"
                      id={`image${index}`}
                      hidden
                    />
                    <img
                      src={
                        files[index]
                          ? URL.createObjectURL(files[index])
                          : assets.upload_area
                      }
                      alt=""
                      className="max-w-24 cursor-pointer"
                    />
                  </label>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex flex-col gap-1">
            <label
              className="text-base font-medium text-white"
              htmlFor="product-name"
            >
              Product Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              id="product-name"
              type="text"
              placeholder="Type here"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex flex-col gap-1 max-w-md">
            <label
              className="text-base font-medium text-white"
              htmlFor="product-description"
            >
              Product Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              id="product-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400 resize-none"
              placeholder="Type here"
              required
              disabled={loading}
            ></textarea>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="w-full flex flex-col gap-1">
            <label
              className="text-base font-medium text-white"
              htmlFor="category"
            >
              Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-600 bg-gray-800 text-white"
              required
              disabled={loading}
            >
              <option value="" className="bg-gray-800 text-white">
                Select Category
              </option>
              {categories.map((item, index) => (
                <option
                  key={index}
                  value={item.path}
                  className="bg-gray-800 text-white"
                >
                  {item.path}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex-1 flex flex-col gap-1 w-32">
              <label
                className="text-base font-medium text-white"
                htmlFor="product-price"
              >
                Product Price
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                id="product-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 w-32">
              <label
                className="text-base font-medium text-white"
                htmlFor="offer-price"
              >
                Offer Price
              </label>
              <input
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-[#00FF41] text-black font-medium rounded hover:bg-[#00CC33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
