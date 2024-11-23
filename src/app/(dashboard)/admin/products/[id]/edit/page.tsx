'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product, Category } from '@/types/product';

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    quantity: '',
    massa: '',
    expired: '',
    is_active: true
  });

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      // 1. Fetch categories
      const categoriesResponse = await fetch(`http://localhost:5000/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!categoriesResponse.ok) {
        const errorData = await categoriesResponse.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }

      const categoriesData = await categoriesResponse.json();
      if (!categoriesData.success) {
        throw new Error('Categories fetch failed');
      }
      setCategories(categoriesData.data);

      // 2. Fetch product details
      const productResponse = await fetch(`http://localhost:5000/api/admin/products/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.message || 'Failed to fetch product');
      }

      const productData = await productResponse.json();
      if (!productData.success || !productData.data) {
        throw new Error('Product fetch failed');
      }

      const product = productData.data;
      setFormData({
        category_id: String(product.category_id) || '',
        name: product.name || '',
        quantity: String(product.quantity) || '',
        massa: product.massa || '',
        expired: product.expired ? product.expired.split('T')[0] : '',
        is_active: product.is_active ?? true
      });

    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch data');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${params.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                ...formData,
                category_id: parseInt(formData.category_id),
                quantity: parseInt(formData.quantity)
              }),
            }
          );

      if (response.ok) {
        toast.success('Product updated successfully');
        router.push('/admin/products');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) return <div className='text-gray-600'>Loading...</div>;

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
        <h1 className="text-2xl text-gray-600 font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="massa" className="block text-sm font-medium text-gray-700">
              Mass
            </label>
            <input
              type="text"
              id="massa"
              name="massa"
              value={formData.massa}
              onChange={handleChange}
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="expired" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              id="expired"
              name="expired"
              value={formData.expired}
              onChange={handleChange}
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}