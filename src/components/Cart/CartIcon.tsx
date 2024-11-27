// components/Cart/CartIcon.tsx
'use client';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const CartIcon = () => {
  const [itemCount, setItemCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !isAuthenticated) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setItemCount(data.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch cart count');
      }
    };

    fetchCartCount();
  }, [isAuthenticated]);

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
          {itemCount}
        </span>
      )}
    </Link>
  );
};