// app/checkout/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup } from "@headlessui/react";
import { Loader2, CreditCard, Truck, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  id: number;
  kabupaten: string;
  kecamatan: string;
  address: string;
  code_pos: string;
}

declare global {
  interface Window {
    snap: any;
  }
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  is_discount?: boolean;
  discount_price?: number;
  seller_name: string;
  seller_phone: string;
  seller_address: string;
  seller_kecamatan: string;
  seller_kabupaten: string;
  seller_province: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [address, setAddress] = useState<Address | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"midtrans" | "cod">(
    "midtrans"
  );

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        console.log("Cart data:", data.data); // Debug
        setCartItems(data.data);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.is_discount
        ? item.discount_price || item.price
        : item.price;
      return sum + price * item.quantity;
    }, 0);

    // Calculate PPN (0.7%)
    const ppn = Math.round(subtotal * 0.007);
    const total = subtotal + ppn;

    return { subtotal, ppn, total };
  };

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_method: paymentMethod,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }
  
      if (data.success) {
        if (paymentMethod === "midtrans" && data.data.snap_token) {
          window.snap.pay(data.data.snap_token, {
            onSuccess: function(result: any) {
              router.push(`/checkout/success/${data.data.transaction_id}`);
            },
            onPending: function(result: any) {
              router.push(`/checkout/success/${data.data.transaction_id}`);
            },
            onError: function(result: any) {
              console.error('Payment error:', result);
              toast.error("Payment failed");
              setProcessing(false);
            },
            onClose: function() {
              toast.error("Payment cancelled");
              setProcessing(false);
            }
          });
        } else {
          router.push(`/checkout/success/${data.data.transaction_id}`);
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to process checkout");
      setProcessing(false);
    }
  };

  const { subtotal, ppn, total } = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Pickup Information
              </h2>
              <div className="text-gray-600">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is a self-pickup order. Please
                    collect your items from the seller&opus; location. If you
                    need delivery, you can discuss it directly with the seller
                    (additional charges may apply).
                  </p>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 py-4 last:border-0"
                  >
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium">Pickup Location:</p>
                      <p>{item.seller_name}</p>
                      <p>{item.seller_address}</p>
                      <p>
                        {item.seller_kecamatan}, {item.seller_kabupaten}
                      </p>
                      <p>{item.seller_province}</p>
                      <p className="mt-2">
                        <a
                          href={`https://wa.me/${item.seller_phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700"
                        >
                          Contact Seller: {item.seller_phone}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="relative w-20 h-20">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.photo}`}
                        alt={item.name}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">
                        {item.quantity} x Rp{" "}
                        {(item.is_discount
                          ? item.discount_price ?? item.price
                          : item.price
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        Rp{" "}
                        {(
                          (item.is_discount
                            ? item.discount_price ?? item.price
                            : item.price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Cost</span>
                  <span>Rp {ppn.toLocaleString()}</span>
                </div>
                <div className="pt-4 flex justify-between font-medium text-gray-900 border-t">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Payment Method
              </h2>
              <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                <div className="space-y-4">
                  <RadioGroup.Option
                    value="midtrans"
                    className={({ checked }) =>
                      `${
                        checked
                          ? "border-green-600 ring-2 ring-green-600"
                          : "border-gray-200"
                      }
                      relative flex cursor-pointer rounded-lg border p-4 focus:outline-none`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label className="font-medium text-gray-900">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Online Payment (Midtrans)
                              </div>
                            </RadioGroup.Label>
                          </div>
                        </div>
                        {checked && (
                          <div className="shrink-0 text-green-600">
                            <Check className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    )}
                  </RadioGroup.Option>

                  <RadioGroup.Option
                    value="cod"
                    className={({ checked }) =>
                      `${
                        checked
                          ? "border-green-600 ring-2 ring-green-600"
                          : "border-gray-200"
                      }
                      relative flex cursor-pointer rounded-lg border p-4 focus:outline-none`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label className="font-medium text-gray-900">
                              <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Cash on Delivery (COD)
                              </div>
                            </RadioGroup.Label>
                          </div>
                        </div>
                        {checked && (
                          <div className="shrink-0 text-green-600">
                            <Check className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    )}
                  </RadioGroup.Option>
                </div>
              </RadioGroup>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                `Pay Rp ${total.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
