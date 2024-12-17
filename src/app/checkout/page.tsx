// app/checkout/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup } from "@headlessui/react";
import { Loader2, CreditCard, Truck, Check, ArrowLeft } from "lucide-react";
import Image from "next/image";
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
  expired: string;
}

const WarningModal = ({
  onClose,
  onContinue,
  agreedToTerms,
  setAgreedToTerms,
}: {
  onClose: () => void;
  onContinue: () => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
}) => (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="fixed inset-0 bg-black opacity-50"></div>
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-center text-gray-900">
            Peringatan Produk Kadaluarsa
          </h3>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Anda akan membeli produk yang telah kadaluarsa. Harap
              diperhatikan:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dilarang keras menjual kembali produk kadaluarsa</li>
              <li>
                Pelanggaran dapat dikenakan sanksi pidana sesuai UU No. 18 Tahun
                2012 tentang Pangan
              </li>
              <li>
                Produk hanya boleh digunakan untuk keperluan non-konsumsi
                (contoh: pupuk, pakan ternak)
              </li>
              <li>
                Jika Anda Tidak Mengikuti Aturan, Kami Akan Melaporkan Anda ke Pihak Berwajib sesuai UU No. 18 Tahun 2012 tentang Pangan
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">
                Saya memahami dan setuju untuk tidak menjual kembali produk
                kadaluarsa
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              onClick={onContinue}
              disabled={!agreedToTerms}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjutkan Pembelian
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const [address, setAddress] = useState<Address | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"midtrans" | "cod">(
    "midtrans"
  );
  const [showWarning, setShowWarning] = useState(false);
  const [hasExpiredItems, setHasExpiredItems] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const checkExpiredItems = useCallback(() => {
    console.log("Checking expired items on load...");
    const expiredItems = cartItems.filter(item => {
      if (!item.expired) return false;
      
      const expiryDate = new Date(item.expired);
      const currentDate = new Date();
      
      expiryDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      return expiryDate < currentDate;
    });

    if (expiredItems.length > 0) {
      console.log("Found expired items:", expiredItems);
      setShowWarning(true);
      setAgreedToTerms(false);
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length > 0) {
      checkExpiredItems();
    }
  }, [cartItems, checkExpiredItems]);

  // Update fetchCart success handler
  const fetchCart = useCallback(async () => {
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
        setCartItems(data.data);
        // Warning check will happen automatically via useEffect
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum: number, item: CartItem) => {
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

  const isExpired = (expiryDate: string) => {
    // Convert dates to local timezone for proper comparison
    const today = new Date();
    const expiry = new Date(expiryDate);
    
    // Format both dates to YYYY-MM-DD for comparison
    const todayStr = today.toISOString().split('T')[0];
    const expiryStr = expiry.toISOString().split('T')[0];
    
    // Compare date strings
    return todayStr > expiryStr;
  };

  const handleCheckoutClick = () => {
    const hasExpiredItems = cartItems.some(item => {
      // Debug logging
      console.log('Checking item:', item.name);
      console.log('Expiry date:', item.expired);
      console.log('Today:', new Date().toISOString());
      const isItemExpired = isExpired(item.expired);
      console.log('Is expired:', isItemExpired);
      return isItemExpired;
    });

    console.log('Has expired items:', hasExpiredItems);
    
    if (hasExpiredItems) {
      setHasExpiredItems(true);
      setShowWarning(true);
    } else {
      handleCheckout();
    }
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
        throw new Error(data.message || "Checkout failed");
      }

      if (data.success) {
        if (paymentMethod === "midtrans" && data.data.snap_token) {
          window.snap.pay(data.data.snap_token, {
            onSuccess: function (result: any) {
              router.push(`/checkout/success/${data.data.transaction_id}`);
            },
            onPending: function (result: any) {
              router.push(`/checkout/success/${data.data.transaction_id}`);
            },
            onError: function (result: any) {
              console.error("Payment error:", result);
              toast.error("Payment failed");
              setProcessing(false);
            },
            onClose: function () {
              toast.error("Payment cancelled");
              setProcessing(false);
            },
          });
        } else {
          router.push(`/checkout/success/${data.data.transaction_id}`);
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to process checkout"
      );
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
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

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
                    collect your items from the seller&apos;s location. If you
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
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.photo}`}
                        alt={item.name}
                        fill
                        className="rounded-lg object-cover"
                        sizes="80px"
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
                  <span>PPN (0,7%)</span>
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
              onClick={handleCheckoutClick}
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
      {showWarning && (
        <WarningModal
          onClose={() => setShowWarning(false)}
          onContinue={() => {
            if (agreedToTerms) {
              setShowWarning(false);
              handleCheckout();
            }
          }}
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
        />
      )}
    </div>
  );
}
