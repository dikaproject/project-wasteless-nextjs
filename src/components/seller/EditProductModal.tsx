import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  category_id: number;
  price: number;
  quantity: number;
  massa: number;
  expired: string;
  photo: string;
}

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditProductModal({ product, onClose, onUpdate }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product.name,
    category_id: product.category_id,
    price: product.price.toString(),
    quantity: product.quantity.toString(),
    massa: product.massa.toString(),
    expired: product.expired,
    photo: null as File | null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (value instanceof File) {
            form.append(key, value);
          } else {
            form.append(key, value.toString());
          }
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/products/${product.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Product updated successfully');
        onUpdate();
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {imagePreview || product.photo ? (
                    <div className="relative w-40 h-40 mx-auto">
                      <Image
                        src={imagePreview || `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.photo}`}
                        alt="Preview"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({ ...prev, photo: file }));
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Other form fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mass (grams)
                </label>
                <input
                  type="number"
                  required
                  value={formData.massa}
                  onChange={(e) => setFormData(prev => ({ ...prev, massa: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.expired}
                  onChange={(e) => setFormData(prev => ({ ...prev, expired: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Updating...
                  </div>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProductModal;