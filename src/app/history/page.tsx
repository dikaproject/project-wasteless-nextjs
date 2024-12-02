"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Package, CreditCard, Clock, Ban, Home, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Image from "next/image";

interface Transaction {
  id: number;
  total_amount: number;
  payment_method: "cod" | "midtrans";
  payment_status: "pending" | "paid" | "failed";
  status: "pending" | "paid" | "delivered" | "cancelled";
  created_at: string;
  total_items: number;
}

const PAGE_SIZE = 5;

export default function History() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        fetchTransactions();
      }, [currentPage, sortOrder]);
    
      const fetchTransactions = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/customer/transactions/history?page=${currentPage}&limit=${PAGE_SIZE}&sort=${sortOrder}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          const data = await response.json();
          if (data.success) {
            setTransactions(data.data.transactions);
            setTotalTransactions(data.data.total);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          toast.error("Failed to load transactions");
        } finally {
          setLoading(false);
        }
      };
    
      const totalPages = Math.ceil(totalTransactions / PAGE_SIZE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-50";
      case "paid":
        return "text-blue-500 bg-blue-50";
      case "delivered":
        return "text-green-500 bg-green-50";
      case "cancelled":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "paid":
        return <CreditCard className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <Ban className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm">
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </span>
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No transactions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to see your transactions here.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{transaction.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(
                        new Date(transaction.created_at),
                        "dd MMM yyyy, HH:mm"
                      )}
                    </p>
                  </div>
                  <div
                    className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {getStatusIcon(transaction.status)}
                    <span className="ml-2 text-sm font-medium capitalize">
                      {transaction.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        {transaction.total_items} item
                        {transaction.total_items > 1 ? "s" : ""}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(transaction.total_amount)}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/history/${transaction.id}`)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

{transactions.length > 0 && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? 'text-gray-400'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? 'text-gray-400'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
