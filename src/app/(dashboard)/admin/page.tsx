'use client';
import { useEffect, useState } from 'react';
import { 
  BarChart,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Loader2
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { useRouter } from 'next/navigation';

interface DashboardData {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  trends: {
    revenue: number;
    orders: number;
    products: number;
    users: number;
  };
  recentOrders: {
    id: number;
    user_name: string;
    total_amount: number;
    payment_status: string;
    status: string;
    created_at: string;
    total_items: number;
  }[];
  recentUsers: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  }[];
  recentSellers: {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    photo_ktp: string;
    photo_usaha: string;
  }[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = [
  {
    title: 'Total Revenue',
    value: `Rp ${data.totalRevenue.toLocaleString()}`,
    icon: DollarSign,
    trend: data.trends.revenue,
  },
  {
    title: 'Total Orders',
    value: data.totalOrders.toString(),
    icon: ShoppingBag,
    trend: data.trends.orders,
  },
  {
    title: 'Total Products',
    value: data.totalProducts.toString(),
    icon: BarChart,
    trend: data.trends.products,
  },
  {
    title: 'Total Users',
    value: data.totalUsers.toString(),
    icon: Users,
    trend: data.trends.users,
  },
];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.trend > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm ml-1 ${
                  stat.trend > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {Math.abs(stat.trend)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-4 text-gray-600">#{order.id}</td>
                  <td className="py-4 text-gray-600">{order.user_name}</td>
                  <td className="py-4 text-gray-600">Rp {order.total_amount.toLocaleString()}</td>
                  <td className="py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500">
                    {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

            {/* Recent Sellers */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Seller Applications</h2>
          <button
            onClick={() => router.push('/admin/seller-applications')}
            className="text-sm text-green-600 hover:text-green-700"
          >
            View All
          </button>
        </div>
        
        {data.recentSellers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pending seller applications</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 text-gray-600">Seller</th>
                  <th className="pb-3 text-gray-600">Contact</th>
                  <th className="pb-3 text-gray-600">Documents</th>
                  <th className="pb-3 text-gray-600">Applied</th>
                  <th className="pb-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSellers.map((seller) => (
                  <tr key={seller.id} className="border-b last:border-0">
                    <td className="py-4 text-gray-600">{seller.name}</td>
                    <td className="py-4">
                      <div className="text-gray-600">{seller.email}</div>
                      <div className="text-gray-500 text-sm">{seller.phone}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/ktp/${seller.photo_ktp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          View KTP
                        </a>
                        <span className="text-gray-300">|</span>
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/usaha/${seller.photo_usaha}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          View Business
                        </a>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500">
                      {formatDistance(new Date(seller.created_at), new Date(), { addSuffix: true })}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => router.push(`/admin/seller-applications`)}
                        className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full hover:bg-green-200"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3 text-gray-600">Name</th>
                <th className="pb-3 text-gray-600">Email</th>
                <th className="pb-3 text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-4 text-gray-600">{user.name}</td>
                  <td className="py-4 text-gray-600">{user.email}</td>
                  <td className="py-4 text-gray-500">
                    {formatDistance(new Date(user.created_at), new Date(), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
