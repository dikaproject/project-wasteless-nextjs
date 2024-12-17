'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category } from '@/types/product';

export default function EditCategory() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
  });

useEffect(() => {
  const fetchCategory = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/categories/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch category');

      const data = await response.json();
      if (data.success && data.data) {
        setFormData({ 
          name: data.data.name || '' 
        });
      }
    } catch (error) {
      toast.error('Failed to fetch category');
      router.push('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  fetchCategory();
}, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${params.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(formData),
            }
          );

      if (response.ok) {
        toast.success('Category updated successfully');
        router.push('/admin/categories');
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      toast.error('Failed to update category');
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
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
              {loading ? 'Updating...' : 'Update Category'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}