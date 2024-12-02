'use client';
import { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { ChartData, Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import toast from 'react-hot-toast';
import { Calendar, Loader2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  dailyRevenue: {
    date: string;
    total_orders: number;
    revenue: number;
  }[];
  topProducts: {
    name: string;
    total_sold: number;
    units_sold: number;
    revenue: number;
  }[];
  categoryStats: {
    name: string;
    total_orders: number;
    units_sold: number;
    revenue: number;
  }[];
}

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`, {
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
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };


const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      type: 'category' as const,
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0,
        maxTicksLimit: 7
      }
    },
    y: {
      type: 'linear' as const,
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        borderDash: [2, 4]
      },
      ticks: {
        callback: function(value: string | number) {
          return `Rp ${Number(value).toLocaleString()}`
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const
  }
};

if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const revenueChartData: ChartData<'line'> = {
    labels: data?.dailyRevenue.map(item => item.date) || [],
    datasets: [
      {
        label: 'Revenue',
        data: data?.dailyRevenue.map(item => item.revenue) || [],
        borderColor: 'rgb(22, 163, 74)',
        backgroundColor: 'rgba(22, 163, 74, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const categoryChartData: ChartData<'doughnut'> = {
    labels: data?.categoryStats.map(item => item.name) || [],
    datasets: [
      {
        data: data?.categoryStats.map(item => item.revenue) || [],
        backgroundColor: [
          'rgba(22, 163, 74, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      }
    ]
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your business metrics</p>
        </div>
        
        {/* Summary Cards */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Date Range:</span>
          </div>
          <div className="flex gap-4 mt-2">
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
              className="border text-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
              className="border text-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Total Revenue',
            value: formatCurrency(data?.dailyRevenue.reduce((sum, item) => sum + item.revenue, 0) || 0),
            trend: '+12.5%',
            trendUp: true
          },
          {
            title: 'Total Orders',
            value: data?.dailyRevenue.reduce((sum, item) => sum + item.total_orders, 0) || 0,
            trend: '+8.2%',
            trendUp: true
          },
          {
            title: 'Average Order Value',
            value: formatCurrency((data?.dailyRevenue.reduce((sum, item) => sum + item.revenue, 0) || 0) / 
                               (data?.dailyRevenue.reduce((sum, item) => sum + item.total_orders, 0) || 1)),
            trend: '-2.4%',
            trendUp: false
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className="text-2xl text-gray-600 font-bold mt-2">{stat.value}</p>
            <span className={`inline-flex items-center text-sm mt-2 ${
              stat.trendUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Category Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={categoryChartData} />
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Best Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-4 font-medium text-gray-600">Product Name</th>
                <th className="pb-4 font-medium text-gray-600">Units Sold</th>
                <th className="pb-4 font-medium text-gray-600">Revenue</th>
                <th className="pb-4 font-medium text-gray-600">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.topProducts.map((product) => (
                <tr key={product.name} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-gray-600">{product.name}</td>
                  <td className="py-4 text-gray-600">{product.units_sold.toLocaleString()}</td>
                  <td className="py-4 text-gray-600">{formatCurrency(product.revenue)}</td>
                  <td className="py-4 text-gray-600">
                    {((product.units_sold / product.total_sold) * 100).toFixed(1)}%
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

export default AnalyticsPage;