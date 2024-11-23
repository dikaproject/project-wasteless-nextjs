'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Package, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Product, Category } from '@/types/product';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch both product and categories
        const [productResponse, categoriesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const productData = await productResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (productData.success && categoriesData.success) {
          setProduct(productData.data);
          setCategories(categoriesData.data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch data');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  if (loading) return <div className='text-gray-600'>Loading...</div>;
  if (!product) return <div className='text-gray-600'>Product not found</div>;

  // Find category name
  const category = categories.find(c => c.id === product.category_id);

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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Product ID: #{product.id}</p>
          </div>
          <Link href={`/admin/products/${params.id}/edit`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Pencil className="w-5 h-5" />
              Edit
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-800">{category?.name || 'Unknown'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Quantity & Mass</p>
                <p className="font-medium text-gray-800">
                  {product.quantity} units ({product.massa})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(product.expired).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`mt-1 px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                  product.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium text-gray-800">
                {new Date(product.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}