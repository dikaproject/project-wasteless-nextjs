// app/admin/orders/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Loader2, Search, Filter, Eye, Truck } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Order {
  id: number;
  user_name: string;
  user_email: string;
  total_amount: number;
  payment_method: 'cod' | 'midtrans';
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  address: string;
  kecamatan: string;
  kabupaten: string;
  code_pos: string;
  created_at: string;
  total_items: number;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  photo: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    search: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  ];

  const handlePaymentStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/payment-status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ payment_status: newStatus })
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        toast.success('Payment status updated successfully');
        // Replace fetchOrderDetails with fetchOrders
        fetchOrders();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update payment status');
      console.error('Payment status update error:', error);
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['status']) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order status updated');
        fetchOrders();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter.status === 'all' || order.status === filter.status;
    const matchesSearch = 
      order.user_name.toLowerCase().includes(filter.search.toLowerCase()) ||
      order.id.toString().includes(filter.search);
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-600">Manage and track all orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10 text-gray-600 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter.status}
          onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
          className="border rounded-lg text-gray-600 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.user_name}</div>
                      <div className="text-sm text-gray-500">{order.user_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{formatCurrency(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className={`text-sm rounded-full px-3 py-1 font-medium ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
  <select
    value={order.payment_status}
    onChange={(e) => handlePaymentStatusUpdate(order.id.toString(), e.target.value)}
    className={`text-sm rounded-full px-3 py-1 font-medium cursor-pointer ${
      order.payment_status === 'paid'
        ? 'bg-green-100 text-green-800' 
        : order.payment_status === 'failed'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800'
    }`}
  >
    <option value="pending">Pending</option>
    <option value="paid">Paid</option>
    <option value="failed">Failed</option>
  </select>
</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(order.created_at), 'dd MMM yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-600">Order #{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedOrder.created_at), 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-600">Customer Details</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{selectedOrder.user_name}</p>
                    <p>{selectedOrder.user_email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">Shipping Address</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{selectedOrder.address}</p>
                    <p>{selectedOrder.kecamatan}, {selectedOrder.kabupaten}</p>
                    <p>Postal Code: {selectedOrder.code_pos}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600">Order Items</h3>
                  <div className="mt-2 space-y-4">
                  {selectedOrder.items?.map((item) => (
    <div key={item.id} className="flex gap-4">
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.photo}`}
        alt={item.product_name}
        width={64}
        height={64}
        className="object-cover rounded"
      />
      <div>
        <p className="font-medium text-gray-600">{item.product_name}</p>
        <p className="text-sm text-gray-600">
          {item.quantity} x {formatCurrency(item.price)}
        </p>
      </div>
    </div>
  ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.total_amount - 15000)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2 text-gray-600">
                    <span>Ppn(0.7%)</span>
                    <span>{formatCurrency(15000)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg mt-4 text-gray-600">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}