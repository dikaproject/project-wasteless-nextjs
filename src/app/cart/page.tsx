"use client";
import { useEffect, useState } from "react";
import { CartItem } from "@/components/Cart/CartItem";
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartProduct {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  stock: number;
  is_discount?: boolean;
  discount_price?: number;
  discount_percentage?: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Harap login terlebih dahulu, untuk melihat keranjang belanja / membeli produk");
      }

      const data = await response.json();

      if (data.success) {
        setCartItems(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
      toast.error("Harap login terlebih dahulu, untuk melihat keranjang belanja / membeli produk");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
  
    cartItems.forEach((item) => {
      const itemPrice = item.is_discount
        ? item.discount_price || item.price
        : item.price;
      const originalTotal = item.price * item.quantity;
      const discountedTotal = itemPrice * item.quantity;
  
      subtotal += originalTotal;
      discount += originalTotal - discountedTotal;
    });
  
    // Calculate PPN (0.7%)
    const ppn = Math.round((subtotal - discount) * 0.007);
    const total = subtotal - discount + ppn;
  
    return { subtotal, discount, ppn, total };
  };
  
  // Update JSX to display PPN
  const { subtotal, discount, ppn, total } = calculateTotals();

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/item/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      if (data.success) {
        // Update cart data after successful update
        fetchCart();
        toast.success("Cart updated");
      }
    } catch (err) {
      console.error("Update quantity error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update quantity"
      );
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/item/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove item");
      }

      if (data.success) {
        // Update cart data after successful removal
        fetchCart();
        toast.success("Item removed from cart");
      }
    } catch (err) {
      console.error("Remove item error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to remove item");
    }
  };

  

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4 sm:mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm sm:text-base text-red-600">{error}</p>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                <ShoppingBag className="w-full h-full text-gray-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Your cart is empty
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y text-gray-700 divide-gray-200">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm sm:text-base text-green-600">
                      <span>Discount</span>
                      <span>- Rp {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>PPN (0,7%)</span>
                    <span>Rp {ppn.toLocaleString()}</span>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-base sm:text-lg font-medium text-gray-900">
                      <span>Total</span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full mt-4 sm:mt-6 flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
