import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface BillFormData {
  name: string;
  amount: string;
  dueDate: string;
  category: string;
  isPaid?: boolean;
}

const EditBill: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<BillFormData>({
    name: "",
    amount: "",
    dueDate: new Date().toISOString().split("T")[0],
    category: "Other",
  });

  const categories = [
    "Utilities",
    "Rent/Mortgage",
    "Insurance",
    "Subscriptions",
    "Credit Card",
    "Phone/Internet",
    "Other",
  ];

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const response = await axios.get(`/api/bills/${id}`);
      const bill = response.data;
      setFormData({
        name: bill.name,
        amount: bill.amount.toString(),
        dueDate: new Date(bill.dueDate).toISOString().split("T")[0],
        category: bill.category,
        isPaid: bill.isPaid,
      });
      setError("");
    } catch (err) {
      setError("Failed to fetch bill");
      console.error("Error fetching bill:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePaid = () => {
    setFormData((prev) => ({
      ...prev,
      isPaid: !prev.isPaid,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.amount ||
      !formData.dueDate ||
      !formData.category
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.put(`/api/bills/${id}`, {
        ...formData,
        amount: parseFloat(formData.amount),
      });

      navigate("/bills");
    } catch (err) {
      setError("Failed to update bill");
      console.error("Error updating bill:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Bill</h1>
          <p className="mt-1 text-sm text-gray-500">Update bill details</p>
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter bill name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rs.</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleTogglePaid}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  formData.isPaid ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span className="sr-only">Toggle paid status</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    formData.isPaid ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="ml-3">
                <span className="text-sm font-medium text-gray-900">
                  Mark as Paid
                </span>
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/bills")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBill;
