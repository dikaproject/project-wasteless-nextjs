// app/seller/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Clock, ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardData {
  totalProducts: number;
  pendingProducts: number;
  activeProducts: number;
  recentOrders: {
    id: number;
    total_amount: number;
    status: string;
    created_at: string;
    user_name: string;
    total_items: number;
  }[];
  productPerformance: {
    name: string;
    total_sales: number;
    units_sold: number;
    revenue: number;
  }[];
}

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 403) {
        const result = await response.json();
        if (result.message === 'Account not activated yet') {
          toast.error('Maaf Akun Anda Belum Dapat Untuk Menjadi Seller, Tunggu Admin Mengkonfirmasi Akun Anda');
          // Optionally redirect the user
          // router.push('/'); // Uncomment if you want to redirect
          setLoading(false);
          return;
        }
      }
      
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const RecentOrders = ({ orders }: { orders: DashboardData['recentOrders'] }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Rp {order.total_amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'delivered' 
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  const ProductPerformance = ({ products }: { products: DashboardData['productPerformance'] }) => (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.name} className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <span className="text-sm text-green-600 font-medium">
              Rp {product.revenue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{product.total_sales} orders</span>
            <span>{product.units_sold} units sold</span>
          </div>
        </div>
      ))}
    </div>
  );

  const stats = [
    {
      title: 'Total Products',
      value: data?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Approval',
      value: data?.pendingProducts || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Active Products',
      value: data?.activeProducts || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your products and monitor your sales
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-white px-6 py-8 shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="bg-white rounded-lg shadow p-6"
  >
    <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
    {data?.recentOrders && <RecentOrders orders={data.recentOrders} />}
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="bg-white rounded-lg shadow p-6"
  >
    <h2 className="text-lg font-medium text-gray-900 mb-4">Product Performance</h2>
    {data?.productPerformance && <ProductPerformance products={data.productPerformance} />}
  </motion.div>
</div>
    </div>
  );
}