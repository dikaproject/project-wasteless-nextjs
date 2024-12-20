'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
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
  quantity: number;
  massa: number;
  expired: string;
  photo: string;
  price: number;
  is_discount: boolean;
  discount_percentage: number;
  start_date: string;
  end_date: string;
}

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    quantity: '',
    massa: '',
    expired: '',
    photo: null as File | null,
    price: '',
    is_discount: false,
    discount: '',
    discount_price: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchProductDetails();
  }, [params.id]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      toast.error('Gagal memuat kategori');
    }
  };

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/products/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        const product = data.data;
        
        // Add timezone offset correction for dates
        const formatDate = (dateString: string | null) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          // Ensure we get YYYY-MM-DD in local timezone
          return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .split('T')[0];
        };
  
        setFormData({
          category_id: String(product.category_id),
          name: product.name,
          quantity: String(product.quantity),
          massa: String(product.massa),
          expired: formatDate(product.expired),
          photo: null,
          price: String(product.price),
          is_discount: product.is_discount,
          discount: product.discount_percentage ? String(product.discount_percentage) : '',
          discount_price: product.discount_price ? String(product.discount_price) : '',
          start_date: formatDate(product.start_date),
          end_date: formatDate(product.end_date),
        });
  
        if (product.photo) {
          setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.photo}`);
        }
      }
    } catch (error) {
      toast.error('Gagal memuat detail produk');
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(Number(number));
  };

  const calculateDiscountPrice = (price: string, discount: string) => {
    const numPrice = Number(price.replace(/\D/g, ''));
    const numDiscount = Number(discount);
    if (!numPrice || !numDiscount) return '';
    const discountAmount = (numPrice * numDiscount) / 100;
    return String(numPrice - discountAmount);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file: File | undefined) => {
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Mohon unggah gambar dalam format JPG, JPEG atau PNG');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran gambar harus kurang dari 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'start_date' || name === 'end_date') {
      // Add timezone offset to maintain the correct date
      const date = new Date(value);
      const offset = date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() + offset);
      
      setFormData(prev => ({
        ...prev,
        [name]: date.toISOString().split('T')[0]
      }));
    } if (name === 'price') {
      const formattedValue = formatCurrency(value);
      const rawPrice = formattedValue.replace(/\./g, '');
      setFormData(prev => ({
        ...prev,
        price: rawPrice,
        discount_price: prev.discount ? calculateDiscountPrice(rawPrice, prev.discount) : '',
      }));
    } else if (name === 'discount') {
      setFormData(prev => ({
        ...prev,
        discount: value,
        discount_price: prev.price ? calculateDiscountPrice(prev.price, value) : '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
  
      // Basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('massa', formData.massa);
      formDataToSend.append('expired', formData.expired);
      formDataToSend.append('price', formData.price);
  
      // Photo if changed
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
  
      // Discount fields
      formDataToSend.append('is_discount', formData.is_discount ? 'true' : 'false');
      
      if (formData.is_discount) {
        formDataToSend.append('discount', formData.discount); // Changed from discount_percentage
        formDataToSend.append('start_date', formData.start_date);
        formDataToSend.append('end_date', formData.end_date);
      }

  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/products/${params.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
  
      const data = await response.json();
  
      if (data.success) {
        toast.success('Produk berhasil diperbarui');
        router.push('/seller/products');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
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
          Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl text-gray-600 font-bold mb-6">Edit Produk</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Harga
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                value={formatCurrency(formData.price)}
                onChange={handleChange}
                className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 pl-12 py-2"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Jumlah
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="massa"
              className="block text-sm font-medium text-gray-700"
            >
              Massa (gram)
            </label>
            <input
              type="text"
              id="massa"
              name="massa"
              value={formData.massa}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="expired"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date
            </label>
            <input
              type="date"
              id="expired"
              name="expired"
              value={formData.expired}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          {/* Discount Section */}
          <AnimatePresence>
            {formData.is_discount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Diskon (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
                    placeholder="0"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label
                    htmlFor="discount_price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Harga Setelah Diskon
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      type="text"
                      name="discount_price"
                      id="discount_price"
                      value={formatCurrency(formData.discount_price)}
                      onChange={handleChange}
                      className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 pl-12 py-2"
                      placeholder="0"
                      readOnly
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tanggal Mulai Diskon
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tanggal Akhir Diskon
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={
                      formData.start_date ||
                      new Date().toISOString().split("T")[0]
                    }
                    className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Upload */}
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl transition-colors duration-200 
      ${
        imagePreview ? "border-green-500 bg-green-50" : "hover:border-gray-400"
      }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="space-y-2 text-center">
              {imagePreview ? (
                <div className="relative group">
                  <div className="relative w-64 h-64 overflow-hidden rounded-xl">
                    <Image
                      src={imagePreview}
                      alt="Gambar Produk"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg group-hover:block"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-600">
                  <Upload className="w-12 h-12" />
                  <p className="text-sm">Seret dan lepas atau klik untuk mengunggah</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>

          {/* Discount Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_discount"
              name="is_discount"
              checked={formData.is_discount}
              onChange={handleChange}
              className="text-green-500 rounded-sm border-gray-300 focus:ring-green-500"
            />
            <label htmlFor="is_discount" className="ml-2 text-sm text-gray-700">
              Tambah Diskon
            </label>
          </div>

          <div className="flex justify-end">
          <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors duration-200"
        >
          {loading ? "Memuat..." : "Perbarui Produk"}
        </button>
          </div>
        </form>
      </div>
    </div>
  );
}