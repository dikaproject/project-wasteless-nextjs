'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, ShoppingBag, Calendar, Hash } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Category } from '@/types/product';

export default function CategoryDetail() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        // Log for debugging
        console.log('Fetching category:', params.id);
  
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${params.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products?category_id=${params.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          })
        ]);
  
        if (!categoryResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const [categoryData, productsData] = await Promise.all([
          categoryResponse.json(),
          productsResponse.json()
        ]);
  
        // Log response data
        console.log('Category response:', categoryData);
  
        // Check if category data is an array and get first item
        if (categoryData.success && categoryData.data) {
          const categoryItem = Array.isArray(categoryData.data) 
            ? categoryData.data[0] 
            : categoryData.data;
  
          if (!categoryItem) {
            throw new Error('Category not found');
          }
  
          setCategory(categoryItem);
          setProductCount(productsData.data.length);
        } else {
          throw new Error('Invalid category data format');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch category');
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!category) return null;

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Category ID: #{category.id}</p>
          </div>
          <Link href={`/admin/categories/${category.id}/edit`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Pencil className="w-5 h-5" />
              Edit Category
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <Hash className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Slug</p>
              <p className="font-medium text-gray-800">{category.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="font-medium text-gray-800">{productCount} items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}