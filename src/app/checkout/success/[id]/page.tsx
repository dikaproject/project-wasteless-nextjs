// app/checkout/success/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Phone, Clock, CheckCircle, Home } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OrderDetails {
  id: number;
  total_amount: number;
  ppn: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  items: {
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    photo: string;
    seller_name: string;
    seller_phone: string;
    seller_address: string;
    seller_kecamatan: string;
    seller_kabupaten: string;
  }[];
}

export default function CheckoutSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log("Order details:", data.data); // Debug
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load order details");
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

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Order Successful!</h1>
                <p className="text-green-100">Order #{order.id}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Pickup Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pickup Information
              </h2>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 mb-4 last:mb-0"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.photo}`}
                      alt={item.product_name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-gray-600">
                        {item.quantity} x Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.seller_name}
                        </p>
                        <p className="text-gray-700">{item.seller_address}</p>
                        <p className="text-gray-700">
                          {item.seller_kecamatan}, {item.seller_kabupaten}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`https://wa.me/${item.seller_phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        {item.seller_phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  Please contact the seller to arrange pickup or discuss
                  delivery options. Any delivery arrangements are between you
                  and the seller.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    Rp {(order.total_amount - order.ppn).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>PPN (0.7%)</span>
                  <span>Rp {order.ppn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>Rp {order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="block text-gray-500">Order Date</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(order.created_at), "dd MMM yyyy, HH:mm")}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-900">
                  {order.payment_method === "midtrans"
                    ? "Online Payment"
                    : "Cash on Pickup"}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Payment Status</span>
                <span
                  className={`font-medium ${
                    order.payment_status === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.payment_status.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Order Status</span>
                <span className="font-medium text-gray-900">
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Please save this order number and
                show it to the seller when picking up your items. You can also
                find this order in your transaction history.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => {
                  // Create print-only content
                  const printContent = document.createElement('div');
                  printContent.className = 'print-section';
                  printContent.innerHTML = `
                    <div class="print-header">
                      <h1 style="font-size: 24px; font-weight: bold;">WasteLess - Order Receipt</h1>
                      <p>Order #${order.id}</p>
                      <p>${format(new Date(order.created_at), "dd MMM yyyy, HH:mm")}</p>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Items</h2>
                      ${order.items.map(item => `
                        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                          <div style="display: flex; justify-content: space-between;">
                            <span>${item.product_name} x ${item.quantity}</span>
                            <span>Rp ${item.price.toLocaleString()}</span>
                          </div>
                          <div style="margin-top: 5px; font-size: 14px; color: #666;">
                            Seller: ${item.seller_name}<br>
                            Pickup: ${item.seller_address}, ${item.seller_kecamatan}, ${item.seller_kabupaten}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                    
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #000;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Subtotal</span>
                        <span>Rp ${(order.total_amount - order.ppn).toLocaleString()}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>PPN (0.7%)</span>
                        <span>Rp ${order.ppn.toLocaleString()}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 1px solid #000;">
                        <span>Total</span>
                        <span>Rp ${order.total_amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div style="margin-top: 30px; padding: 15px; border: 1px solid #000; font-size: 14px;">
                      <p><strong>Payment Method:</strong> ${order.payment_method === "midtrans" ? "Online Payment" : "Cash on Pickup"}</p>
                      <p><strong>Payment Status:</strong> ${order.payment_status.toUpperCase()}</p>
                      <p><strong>Note:</strong> Please show this receipt when picking up your items.</p>
                    </div>
                  `;

                  // Add to document, print, then remove
                  document.body.appendChild(printContent);
                  window.print();
                  document.body.removeChild(printContent);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Print Receipt
              </button>
              <button
                onClick={() => router.push("/history")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                View Order History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
