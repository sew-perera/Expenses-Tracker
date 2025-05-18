import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { format, parseISO, isPast, addDays } from "date-fns";

interface WarrantyInterface {
  _id: string;
  productName: string;
  expirationDate: string;
  category: string;
  purchaseDate?: string;
  retailer?: string;
}

const Warranties: React.FC = () => {
  const [warranties, setWarranties] = useState<WarrantyInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWarranties();
  }, []);

  // const fetchWarranties = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("/api/warranties");
  //     setWarranties(response.data);
  //     setError("");
  //   } catch (err) {
  //     setError("Failed to fetch warranties");
  //     console.error("Error fetching warranties:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/warranties");
  
      // Adjust based on actual API shape
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.warranties;
  
      setWarranties(data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch warranties");
      console.error("Error fetching warranties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this warranty?"))
      return;

    try {
      await axios.delete(`/api/warranties/${id}`);
      setWarranties(warranties.filter((warranty) => warranty._id !== id));
    } catch (err) {
      setError("Failed to delete warranty");
      console.error("Error deleting warranty:", err);
    }
  };

  const getWarrantyStatus = (expirationDate: string) => {
    if (isPast(parseISO(expirationDate))) {
      return { text: "Expired", color: "text-red-600 bg-red-100" };
    }
    if (isPast(addDays(parseISO(expirationDate), -30))) {
      return {
        text: "Expiring Soon",
        color: "text-yellow-600 bg-yellow-100",
      };
    }
    return { text: "Active", color: "text-green-600 bg-green-100" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Warranties</h1>
        <Link
          to="/warranties/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Warranty
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {warranties.map((warranty) => {
            const status = getWarrantyStatus(warranty.expirationDate);
            return (
              <li key={warranty._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {warranty.productName}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <div className="mt-1">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="truncate">
                            {warranty.category}
                          </span>
                        </p>
                        {warranty.retailer && (
                          <p className="mt-1 text-sm text-gray-500">
                            Retailer: {warranty.retailer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                      <div className="flex flex-col text-right">
                        {warranty.purchaseDate && (
                          <p className="text-sm text-gray-500">
                            Purchased:{" "}
                            {format(
                              parseISO(warranty.purchaseDate),
                              "MMM d, yyyy"
                            )}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Expires:{" "}
                          {format(
                            parseISO(warranty.expirationDate),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/warranties/${warranty._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(warranty._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          {warranties.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No warranties found. Click the "Add Warranty" button to
              create one.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Warranties;
