import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  DollarSign,
  Receipt,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { format, parseISO } from "date-fns";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

interface ExpenseSummary {
  _id: string;
  total: number;
  count: number;
}

interface BillInterface {
  _id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
}

interface WarrantyInterface {
  _id: string;
  productName: string;
  expirationDate: string;
  category: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [upcomingBills, setUpcomingBills] = useState<BillInterface[]>([]);
  const [expiringWarranties, setExpiringWarranties] = useState<
    WarrantyInterface[]
  >([]);
  const [categoryData, setCategoryData] = useState<ExpenseSummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch monthly expense data
        const monthlyRes = await axios.get(
          "/api/expenses/summary/monthly"
        );
        setMonthlyData(monthlyRes.data);
        console.log("monthlyResData", monthlyRes.data);

        // Calculate total expenses for the current year
        const currentYearTotal = monthlyRes.data.reduce(
          (sum: number, month: any) => sum + month.total,
          0
        );
        setTotalExpenses(currentYearTotal);

        // Fetch category breakdown
        const categoryRes = await axios.get(
          "/api/expenses/summary/category"
        );
        setCategoryData(categoryRes.data);
        console.log("categoryRes", categoryRes);

        // Fetch upcoming bills
        const billsRes = await axios.get("/api/bills/upcoming/reminders");
        setUpcomingBills(billsRes.data);
        console.log("billRes", billsRes);

        // Fetch expiring warranties
        const warrantiesRes = await axios.get(
          "/api/warranties/expiring/soon"
        );
        setExpiringWarranties(warrantiesRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const categoryChartData = {
    labels: categoryData.map((cat) => cat._id),
    datasets: [
      {
        data: categoryData.map((cat) => cat.total),
        backgroundColor: [
          "#3B82F6", // blue
          "#10B981", // green
          "#F97316", // orange
          "#8B5CF6", // purple
          "#EC4899", // pink
          "#6366F1", // indigo
          "#14B8A6", // teal
          "#F43F5E", // rose
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyData.map((month) => month.total),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
    ],
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Expenses (This Year)
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      Rs.{totalExpenses.toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link
                to="/expenses"
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                View all expenses
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Bills
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {upcomingBills.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link
                to="/bills"
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                Manage bills
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-teal-500 rounded-md p-3">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Warranties Expiring Soon
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {expiringWarranties.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link
                to="/warranties"
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                View warranties
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Monthly Expenses
          </h2>
          <div className="h-64">
            <Line
              data={monthlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return "Rs." + value;
                      },
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Expenses by Category Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Expenses by Category
          </h2>
          <div className="h-64 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <Doughnut
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-center">
                No category data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access and Reminders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bills */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Upcoming Bills
            </h3>
            <Link
              to="/bills/add"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Bill
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {upcomingBills.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingBills.slice(0, 5).map((bill) => (
                  <li key={bill._id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {bill.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {bill.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          Rs.{bill.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due:{" "}
                          {format(parseISO(bill.dueDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <Clock className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No upcoming bills</p>
              </div>
            )}

            {upcomingBills.length > 5 && (
              <div className="mt-5 text-center">
                <Link
                  to="/bills"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all upcoming bills
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Expiring Warranties */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Expiring Warranties
            </h3>
            <Link
              to="/warranties/add"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Warranty
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {expiringWarranties.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {expiringWarranties.slice(0, 5).map((warranty) => (
                  <li key={warranty._id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {warranty.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {warranty.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Expires:{" "}
                          {format(
                            parseISO(warranty.expirationDate),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <ShieldCheck className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  No warranties expiring soon
                </p>
              </div>
            )}

            {expiringWarranties.length > 5 && (
              <div className="mt-5 text-center">
                <Link
                  to="/warranties"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all warranties
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/expenses/add"
              className="relative block border rounded-lg bg-white p-6 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold rounded-bl bg-blue-100 text-blue-600">
                New
              </span>
              <DollarSign className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="text-base font-semibold text-gray-900">
                Add Expense
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Record a new expense
              </p>
            </Link>

            <Link
              to="/bills/add"
              className="block border rounded-lg bg-white p-6 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-md transition-shadow duration-300"
            >
              <Receipt className="h-8 w-8 text-orange-500 mb-3" />
              <h3 className="text-base font-semibold text-gray-900">
                Add Bill
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Schedule a new bill
              </p>
            </Link>

            <Link
              to="/warranties/add"
              className="block border rounded-lg bg-white p-6 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-md transition-shadow duration-300"
            >
              <ShieldCheck className="h-8 w-8 text-teal-500 mb-3" />
              <h3 className="text-base font-semibold text-gray-900">
                Add Warranty
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Track a product warranty
              </p>
            </Link>

            <Link
              to="/profile"
              className="block border rounded-lg bg-white p-6 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-md transition-shadow duration-300"
            >
              <User className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="text-base font-semibold text-gray-900">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your preferences
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
