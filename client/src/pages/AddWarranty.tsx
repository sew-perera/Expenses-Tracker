import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface WarrantyFormData {
  productName: string;
  expirationDate: string;
  category: string;
  purchaseDate?: string;
  retailer?: string;
}

const AddWarranty: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<WarrantyFormData>({
    productName: "",
    expirationDate: "",
    category: "Electronics",
    purchaseDate: "",
    retailer: "",
  });

  const categories = [
    "Electronics",
    "Appliances",
    "Furniture",
    "Automotive",
    "Tools",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.expirationDate ||
      !formData.category
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("/api/warranties", {
        ...formData,
        purchaseDate: formData.purchaseDate || undefined,
        retailer: formData.retailer || undefined,
      });

      navigate("/warranties");
    } catch (err) {
      setError("Failed to create warranty");
      console.error("Error creating warranty:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add Warranty
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new warranty record
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="productName"
                id="productName"
                value={formData.productName}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter product name"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category *
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="purchaseDate"
              className="block text-sm font-medium text-gray-700"
            >
              Purchase Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="purchaseDate"
                id="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="expirationDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date *
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="expirationDate"
                id="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="retailer"
              className="block text-sm font-medium text-gray-700"
            >
              Retailer
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="retailer"
                id="retailer"
                value={formData.retailer}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter retailer name"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/warranties")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Warranty"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarranty;
