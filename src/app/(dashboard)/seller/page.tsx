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
        {/* Recent Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
          {/* Add orders table/list here */}
        </motion.div>

        {/* Product Performance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Performance</h2>
          {/* Add product stats/chart here */}
        </motion.div>
      </div>
    </div>
  );
}