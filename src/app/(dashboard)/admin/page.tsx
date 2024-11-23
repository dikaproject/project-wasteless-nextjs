"use client";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import { TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Add to imports
import { formatDistance } from "date-fns";

// Add sample data
const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    product: "Fresh Vegetables Bundle",
    amount: 150.0,
    status: "completed",
    date: new Date(2024, 2, 15),
  },
  {
    id: "#ORD-002",
    customer: "Sarah Smith",
    product: "Organic Fruits Pack",
    amount: 89.99,
    status: "pending",
    date: new Date(2024, 2, 14),
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    product: "Bakery Bundle",
    amount: 45.5,
    status: "processing",
    date: new Date(2024, 2, 14),
  },
  {
    id: "#ORD-004",
    customer: "Emma Davis",
    product: "Mixed Fresh Pack",
    amount: 120.0,
    status: "completed",
    date: new Date(2024, 2, 13),
  },
];

// Chart data and options
const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales 2024",
      data: [30, 45, 57, 48, 65, 73],
      borderColor: "rgb(22, 163, 74)",
      backgroundColor: "rgba(22, 163, 74, 0.5)",
      tension: 0.4,
    },
    {
      label: "Sales 2023",
      data: [25, 38, 42, 35, 50, 60],
      borderColor: "rgb(203, 213, 225)",
      backgroundColor: "rgba(203, 213, 225, 0.5)",
      tension: 0.4,
    },
  ],
};

const ordersData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Orders",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "rgba(22, 163, 74, 0.8)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sales & Orders Overview",
      color: "#1f2937",
      font: {
        size: 16,
        weight: "normal" as const,
      },
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      type: "category" as const,
      grid: {
        display: false,
      },
    },
  },
};

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Revenue",
            value: "$12,345",
            icon: <DollarSign />,
            trend: "+12.5%",
          },
          {
            title: "Total Orders",
            value: "156",
            icon: <ShoppingBag />,
            trend: "+8.2%",
          },
          {
            title: "Total Users",
            value: "2,345",
            icon: <Users />,
            trend: "+15.8%",
          },
          {
            title: "Total Sales",
            value: "$8,945",
            icon: <TrendingUp />,
            trend: "+10.3%",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                {stat.icon}
              </div>
            </div>
            <p className="text-green-600 text-sm mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {stat.trend} from last month
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Line data={salesData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Bar data={ordersData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Order ID
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Product
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 text-sm font-medium text-gray-800">
                    {order.id}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {order.customer}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {order.product}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${order.status === "completed" && "bg-green-100 text-green-800"}
                ${order.status === "pending" && "bg-yellow-100 text-yellow-800"}
                ${order.status === "processing" && "bg-blue-100 text-blue-800"}
              `}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {formatDistance(order.date, new Date(), {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
