// app/(auth)/seller/register/page.tsx
'use client';
import { Store } from 'lucide-react';
import RegisterFormSeller from '@/components/forms/RegisterFormSeller';
import Link from 'next/link';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';

export default function SellerRegisterPage() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-28">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Store className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bergabung dengan WasteLess
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Perluas jangkauan bisnis Anda dan bantu kurangi limbah makanan. 
            Dapatkan akses ke pelanggan yang peduli lingkungan dan kelola inventaris Anda dengan mudah.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <Link 
              href="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Sudah punya akun? Login
            </Link>
          </div>
          
          <RegisterFormSeller />
        </div>
      </div>
    </div>
     <Footer />
     </>
  );
}