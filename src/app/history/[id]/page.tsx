'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface TransactionItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  photo: string;
}

interface TransactionDetail {
  id: number;
  total_amount: number;
  ppn: number;
  payment_method: 'cod' | 'midtrans';
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  created_at: string;
  items: TransactionItem[];
}

export default function TransactionDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionDetail();
  }, [params.id]);

  const fetchTransactionDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/transactions/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setTransaction(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to load transaction details');
      router.push('/history');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
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

  if (!transaction) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to History
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{transaction.id}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(transaction.created_at), 'dd MMM yyyy, HH:mm')}
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700">
                {transaction.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {transaction.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0 w-20 h-20 relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.photo}`}
                      alt={item.product_name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Details
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-900 uppercase">
                  {transaction.payment_method}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Status</span>
                <span className="text-gray-900 uppercase">
                  {transaction.payment_status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">PPN (0.7%)</span>
                <span className="text-gray-900">
                  {formatCurrency(transaction.ppn)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-gray-900">
                  {formatCurrency(transaction.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}