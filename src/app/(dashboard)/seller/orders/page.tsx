"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Filter, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Order {
  id: number;
  user_name: string;
  total_amount: number;
  status: "pending" | "shipped" | "delivered";
  payment_status: "pending" | "paid" | "failed";
  payment_method: "cod" | "midtrans";
  created_at: string;
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState({
    status: "all",
    search: "",
  });
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const updatePaymentStatus = async (
    orderId: number,
    status: Order["payment_status"]
  ) => {
    try {
      setUpdatingStatus(orderId);
      const token = localStorage.getItem("token");
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${orderId}/payment-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ payment_status: status }),
        }
      );
  
      const data = await response.json();
      if (data.success) {
        await fetchOrders();
        toast.success("Payment status updated");
      }
    } catch (err) {
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: number,
    status: Order["status"]
  ) => {
    try {
      setUpdatingStatus(orderId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update status");
      }

      const data = await response.json();

      if (data.success) {
        await fetchOrders();
        toast.success("Order status updated");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filter.status === "all" || order.status === filter.status;
    const matchesSearch = order.user_name
      .toLowerCase()
      .includes(filter.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const StatusUpdateOverlay = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <p className="text-gray-600 font-medium">Melakukan Update Status Produk... Mohon Bersabar Menunggu</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Atur Order Kamu Dan Status Pengiriman
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={filter.search}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, search: e.target.value }))
            }
            className="pl-10 pr-4 text-gray-700 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter.status}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, status: e.target.value }))
          }
          className="border text-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-gray-600">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
    Status Pembayaran
  </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">#{order.id}</td>
                  <td className="px-6 py-4">{order.user_name}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value as Order["status"]
                        )
                      }
                      disabled={updatingStatus !== null} // Disable all selects while any update is in progress
                      className={`text-sm rounded-full px-3 py-1 font-medium transition-colors
    ${
      updatingStatus === order.id
        ? "bg-gray-100 text-gray-500"
        : order.status === "delivered"
        ? "bg-green-100 text-green-800"
        : order.status === "shipped"
        ? "bg-blue-100 text-blue-800"
        : "bg-yellow-100 text-yellow-800"
    }
    ${
      updatingStatus !== null
        ? "cursor-not-allowed opacity-50"
        : "cursor-pointer hover:opacity-80"
    }
  `}
                    >
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
  {order.payment_method === 'cod' ? (
    <select
      value={order.payment_status}
      onChange={(e) =>
        updatePaymentStatus(
          order.id,
          e.target.value as Order["payment_status"]
        )
      }
      disabled={updatingStatus !== null}
      className={`text-sm rounded-full px-3 py-1 font-medium
        ${
          order.payment_status === 'paid'
            ? 'bg-green-100 text-green-800'
            : order.payment_status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }
      `}
    >
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="failed">Failed</option>
    </select>
  ) : (
    <span className={`text-sm rounded-full px-3 py-1 font-medium
      ${
        order.payment_status === 'paid'
          ? 'bg-green-100 text-green-800'
          : order.payment_status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }
    `}>
      {order.payment_status}
    </span>
  )}
</td>
                  <td className="px-6 py-4">
                    Rp {order.total_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(order.created_at), "dd MMM yyyy")}
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Order Detail Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-700">
                  Order #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              {/* Add order details here */}
              <div className="mt-6 space-y-6">
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Customer Information
                  </h3>
                  <p className="text-gray-600">
                    Name: {selectedOrder.user_name}
                  </p>
                  <p className="text-gray-600">
                    Order Date:{" "}
                    {format(
                      new Date(selectedOrder.created_at),
                      "dd MMM yyyy HH:mm"
                    )}
                  </p>
                  <p className="text-gray-600">
                    Status:
                    <span
                      className={`ml-2 inline-block rounded-full px-2 py-1 text-sm font-medium
                            ${
                              selectedOrder.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : selectedOrder.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Order Items
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-gray-700">
                    <p className="font-semibold">Total Amount</p>
                    <p className="font-bold text-lg">
                      Rp {selectedOrder.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {updatingStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StatusUpdateOverlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
