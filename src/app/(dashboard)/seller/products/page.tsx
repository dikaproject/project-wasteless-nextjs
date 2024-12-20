// app/seller/products/page.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  category_name: string;
  quantity: number;
  price: number;
  photo: string;
  is_active: boolean;
  is_discount: boolean;
  discount_price: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
}
export default function ProductsManagement() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewProduct, setSelectedViewProduct] =
    useState<Product | null>(null);

  // Add ProductViewModal component
  const ProductViewModal = ({
    product,
    onClose,
  }: {
    product: Product;
    onClose: () => void;
  }) => {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="bg-white rounded-xl overflow-hidden w-full max-w-2xl relative z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="relative aspect-video">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.photo}`}
              alt={product.name}
              fill
              className="object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-gray-600">{product.category_name}</p>
              </div>
              {!product.is_active && (
                <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">
                  Pending Approval
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Price Section */}
              <div>
                <span className="text-gray-600">Price</span>
                <div className="mt-1">
                  {product.is_discount && isDiscountActive(product) ? (
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500 line-through">
                        Rp {product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">
                          Rp {product.discount_price.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                          -{product.discount_percentage}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      Rp {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div>
                <span className="text-gray-600">Stock</span>
                <p
                  className={`mt-1 font-medium ${
                    product.quantity > 10 ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {product.quantity} units
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && product.is_active) ||
      (filter === "pending" && !product.is_active);
    return matchesSearch && matchesFilter;
  });

  const isDiscountActive = (product: Product) => {
    if (!product.is_discount || !product.start_date || !product.end_date) {
      return false;
    }

    const now = new Date();
    const startDate = new Date(product.start_date);
    const endDate = new Date(product.end_date);

    return now >= startDate && now <= endDate;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-600 mt-1">Manage your product listings</p>
        </div>
        <Link
          href="/seller/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border text-gray-700 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <div className="relative aspect-video">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.photo}`}
                alt={product.name}
                fill
                className="object-cover"
              />
              {!product.is_active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                    Pending Approval
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {product.category_name}
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-3">
  {product.is_discount ? (
    isDiscountActive(product) ? (
      <div className="space-y-1">
        <span className="text-sm text-gray-500 line-through">
          Rp {product.price.toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-green-600">
            Rp {product.discount_price.toLocaleString()}
          </span>
          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
            -{product.discount_percentage}%
          </span>
        </div>
      </div>
    ) : (
      <span className="text-lg font-semibold text-gray-900">
        Rp {product.price.toLocaleString()}
      </span>
    )
  ) : (
    <span className="text-lg font-semibold text-gray-900">
      Rp {product.price.toLocaleString()}
    </span>
  )}
</div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Stock:</span>
                <span
                  className={`text-sm font-medium ${
                    product.quantity > 10 ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {product.quantity} units
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedViewProduct(product);
                    setViewModalOpen(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    router.push(`/seller/products/${product.id}/edit`)
                  }
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setProductToDelete(product.id);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="text-gray-500 mt-1">
            {searchTerm
              ? "Try adjusting your search"
              : "Start by adding your first product"}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setDeleteModalOpen(false)}
            />
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (productToDelete) {
                      handleDelete(productToDelete);
                      setDeleteModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewModalOpen && selectedViewProduct && (
          <ProductViewModal
            product={selectedViewProduct}
            onClose={() => {
              setViewModalOpen(false);
              setSelectedViewProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
