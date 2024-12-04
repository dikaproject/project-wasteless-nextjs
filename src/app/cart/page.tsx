"use client";
import { useEffect, useState } from "react";
import { CartItem } from "@/components/Cart/CartItem";
import { Loader2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

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
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();

      if (data.success) {
        setCartItems(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
      toast.error("Failed to load cart");
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

    return { subtotal, discount, total: subtotal - discount };
  };

  const { subtotal, discount, total } = calculateTotals();

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
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6">
                <ShoppingBag className="w-full h-full text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
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

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-base text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-base text-green-600">
                      <span>Discount</span>
                      <span>- Rp {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base text-gray-600">
                    <span>PPN (0,7%)</span>
                    <span>Free</span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-medium text-gray-900">
                      <span>Total</span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full mt-6 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
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
