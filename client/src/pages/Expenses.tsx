import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ExpenseInterface {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  // const fetchExpenses = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("/api/expenses");
  //     setExpenses(response.data);
  //     setError("");
  //   } catch (err) {
  //     setError("Failed to fetch expenses");
  //     console.error("Error fetching expenses:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/expenses");
  
      console.log("Fetched data:", response.data); // <-- inspect this
      const data = Array.isArray(response.data) ? response.data : response.data.expenses;
      setExpenses(data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch expenses");
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (err) {
      setError("Failed to delete expense");
      console.error("Error deleting expense:", err);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <Link
          to="/expenses/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Expense
        </Link>
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

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {expense.description}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="truncate">{expense.category}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Rs.{expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(expense.date), "MMM d, yyyy")}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/expenses/${expense._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {expenses.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No expenses found. Click the "Add Expense" button to create
              one.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Expenses;
