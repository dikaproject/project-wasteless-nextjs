'use client';
import { useState, useEffect } from 'react';
import { Loader2, Search, Check, X, Eye } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface PendingProduct {
  id: number;
  name: string;
  seller_name: string;
  seller_email: string;
  category_name: string;
  quantity: number;
  price: number;
  photo: string;
  massa: number;
  expired: string;
  created_at: string;
}

export default function SellerManagement() {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/seller-products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error('Failed to load pending products');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/seller-products/${productId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product approved successfully');
        fetchPendingProducts();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error('Failed to approve product');
    }
  };

  const handleReject = async (productId: number) => {
    if (!rejectionReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/seller-products/${productId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product rejected');
        setSelectedProduct(null);
        setRejectionReason('');
        fetchPendingProducts();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error('Failed to reject product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-800">Seller Products Management</h1>
          <p className="text-gray-600">Review and approve seller products</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by product or seller name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 text-gray-600 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Seller</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.photo}`}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{product.seller_name}</div>
                      <div className="text-sm text-gray-500">{product.seller_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category_name}</td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-gray-600">{product.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(product.created_at), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection/Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-600">Product Details</h2>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${selectedProduct.photo}`}
                    alt={selectedProduct.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <h3 className="font-medium text-gray-600">Product Name</h3>
                    <p>{selectedProduct.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">Category</h3>
                    <p>{selectedProduct.category_name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">Price</h3>
                    <p>{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">Stock</h3>
                    <p>{selectedProduct.quantity}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">Weight</h3>
                    <p>{selectedProduct.massa}g</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">Expiry Date</h3>
                    <p>{format(new Date(selectedProduct.expired), 'dd MMM yyyy')}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-600 mb-2">Rejection Reason</h3>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full p-2 border text-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleApprove(selectedProduct.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedProduct.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}