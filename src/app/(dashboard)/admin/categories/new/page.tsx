// src/app/(dashboard)/admin/categories/new/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // validasi category name max 25 karakter 
    if (formData.name.length > 25) {
      toast.error('Kategori Harus Kurang Dari 25 Karakter');
      return;
    }
    // validasi jika ada angka
    if (/\d/.test(formData.name)) {
      toast.error('Kategori tidak boleh mengandung angka');
      return;
    }
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Category created successfully');
        router.push('/admin/categories');
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      toast.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-600 mb-6">New Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}