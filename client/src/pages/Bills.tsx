import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { format, parseISO, isPast, addDays } from "date-fns";

interface BillInterface {
  _id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid?: boolean;
}

const Bills: React.FC = () => {
  const [bills, setBills] = useState<BillInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBills();
  }, []);

  // const fetchBills = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("/api/bills");
  //     setBills(response.data);
  //     setError("");
  //   } catch (err) {
  //     setError("Failed to fetch bills");
  //     console.error("Error fetching bills:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/bills");
      console.log("Fetched bills:", response.data); // Debug
  
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.bills;
  
      setBills(data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch bills");
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bill?"))
      return;

    try {
      await axios.delete(`/api/bills/${id}`);
      setBills(bills.filter((bill) => bill._id !== id));
    } catch (err) {
      setError("Failed to delete bill");
      console.error("Error deleting bill:", err);
    }
  };

  const handleTogglePaid = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/bills/${id}`, { isPaid: !currentStatus });
      setBills(
        bills.map((bill) =>
          bill._id === id ? { ...bill, isPaid: !currentStatus } : bill
        )
      );
    } catch (err) {
      setError("Failed to update bill status");
      console.error("Error updating bill status:", err);
    }
  };

  const getBillStatus = (dueDate: string, isPaid?: boolean) => {
    if (isPaid) {
      return { text: "Paid", color: "text-green-600 bg-green-100" };
    }
    if (isPast(parseISO(dueDate))) {
      return { text: "Overdue", color: "text-red-600 bg-red-100" };
    }
    if (isPast(addDays(new Date(), -3))) {
      return { text: "Due Soon", color: "text-yellow-600 bg-yellow-100" };
    }
    return { text: "Upcoming", color: "text-blue-600 bg-blue-100" };
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
        <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
        <Link
          to="/bills/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Bill
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
          {bills.map((bill) => {
            const status = getBillStatus(bill.dueDate, bill.isPaid);
            return (
              <li key={bill._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {bill.name}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">{bill.category}</span>
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Rs.{bill.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due:{" "}
                        {format(parseISO(bill.dueDate), "MMM d, yyyy")}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleTogglePaid(
                              bill._id,
                              bill.isPaid || false
                            )
                          }
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            bill.isPaid
                              ? "bg-gray-100 text-gray-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {bill.isPaid ? "Mark Unpaid" : "Mark Paid"}
                        </button>
                        <Link
                          to={`/bills/${bill._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(bill._id)}
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
          {bills.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No bills found. Click the "Add Bill" button to create one.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Bills;
