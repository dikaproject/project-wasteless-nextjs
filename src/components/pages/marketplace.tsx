"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  Check,
  ShoppingBag,
  MapPin,
  X,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  name: string;
  slug: string;
  photo_id: number;
  quantity: number;
  massa: number;
  expired: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  category_name: string;
  photo: string;
  price: number;
  is_discount: boolean | null;
  discount_percentage: number | null;
  discount_price: number | null;
  start_date: string | null;
  end_date: string | null;
  province: string;
  kabupaten: string;
  kecamatan: string;
  seller_name: string;
  address: string | null;
}

interface FilterOptions {
  category: string;
  kecamatan: string;
  minPrice: number;
  maxPrice: number;
  showExpired: boolean;
  onlyDiscounted: boolean;
}

interface District {
  id: string;
  regency_id: string;
  name: string;
}

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const MarketplacePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 10000000, // 10 million IDR
  });
  const [showExpired, setShowExpired] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedRegencyId, setSelectedRegencyId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const sortOptions = ["Latest", "Price: Low to High", "Price: High to Low"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        category: selectedCategory !== "All" ? selectedCategory : "",
        province: selectedProvince || "",
        kabupaten: selectedRegency || "",
        kecamatan: selectedDistrict || "",
        minPrice: priceRange.min.toString(),
        maxPrice: priceRange.max.toString(),
        showExpired: showExpired.toString(),
        onlyDiscounted: onlyDiscounted.toString(),
        sort:
          selectedSort === "Price: Low to High"
            ? "price_asc"
            : selectedSort === "Price: High to Low"
            ? "price_desc"
            : "latest",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/all?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const isDiscountActive = (product: Product) => {
    if (!product.is_discount || !product.start_date || !product.end_date) {
      return false;
    }

    const now = new Date();
    const startDate = new Date(product.start_date);
    const endDate = new Date(product.end_date);

    return now >= startDate && now <= endDate;
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("/api/proxy-location?type=provinces");
        const data = await response.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
        setProvinces([]);
      }
    };

    fetchProvinces();
  }, []);

  // Update the fetchRegencies useEffect
  useEffect(() => {
    const fetchRegencies = async () => {
      if (!selectedProvinceId) return; // Use selectedProvinceId instead of selectedProvince

      try {
        const response = await fetch(
          `/api/proxy-location?type=regencies&id=${selectedProvinceId}` // Use selectedProvinceId
        );
        const data = await response.json();
        setRegencies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch regencies:", error);
        setRegencies([]);
      }
    };

    fetchRegencies();
  }, [selectedProvinceId]); // Change dependency to selectedProvinceId

  // Similarly update the fetchDistricts useEffect
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedRegencyId) return; // Use selectedRegencyId

      try {
        const response = await fetch(
          `/api/proxy-location?type=districts&id=${selectedRegencyId}` // Use selectedRegencyId
        );
        const data = await response.json();
        setDistricts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [selectedRegencyId]); // Change dependency to selectedRegencyId

  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    selectedCategory,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    priceRange,
    showExpired,
    onlyDiscounted,
    selectedSort,
  ]);

  const addToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!isAuthenticated || !token) {
        toast.error("Please login first");
        return;
      }

      console.log("Token:", token); // Debug token

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      const data = await response.json();
      console.log("Response:", data); // Debug response

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      if (data.success) {
        toast.success("Product added to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to add product to cart"
      );
    }
  };

  const ProductModal = ({
    product,
    onClose,
  }: {
    product: Product;
    onClose: () => void;
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
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
              className="absolute top-4 right-4 rounded-full p-2 shadow-lg"
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
                <p className="text-sm text-gray-500">{product.category_name}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(
                      isDiscountActive(product)
                        ? Number(product.discount_price) ||
                            Number(product.price)
                        : Number(product.price)
                    )}
                  </span>
                  {isDiscountActive(product) &&
                    product.is_discount &&
                    product.discount_percentage &&
                    product.discount_percentage > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(Number(product.price))}
                      </span>
                    )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Seller</span>
                <p className="font-medium text-gray-900">
                  {product.seller_name}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Location</span>
                <p className="font-medium text-gray-900">
                  {product.kecamatan}, {product.kabupaten}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Stock</span>
                <p className="font-medium text-gray-900">
                  {product.quantity} items
                </p>
              </div>
              <div>
                <span className="text-gray-500">Weight</span>
                <p className="font-medium text-gray-900">
                  {product.massa} grams
                </p>
              </div>
              <div>
                <span className="text-gray-500">Expires on</span>
                <p className="font-medium text-gray-900">
                  {format(new Date(product.expired), "dd MMM yyyy")}
                </p>
              </div>
              {product.is_discount &&
                product.discount_percentage &&
                product.discount_percentage > 0 && (
                  <div className="col-span-2 bg-red-50 p-4 rounded-lg">
                    <span className="text-gray-700 font-medium">
                      Discount Period
                    </span>
                    <div className="mt-2 space-y-1">
                      <p className="text-red-600 font-medium">
                        {product.discount_percentage}% OFF
                      </p>
                      {isDiscountActive(product) ? (
                        <>
                          <p className="text-sm text-gray-600">
                            Valid until:{" "}
                            {format(new Date(product.end_date!), "dd MMM yyyy")}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {new Date(product.start_date!) > new Date()
                            ? `Starts from: ${format(
                                new Date(product.start_date!),
                                "dd MMM yyyy"
                              )}`
                            : `Ended on: ${format(
                                new Date(product.end_date!),
                                "dd MMM yyyy"
                              )}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              <div className="col-span-2">
                {" "}
                {/* Make address take full width */}
                <span className="text-gray-500">Pickup Location</span>
                <div className="mt-1">
                  <p className="font-medium text-gray-900">
                    {product.seller_name}
                  </p>
                  <p className="text-gray-600">
                    {product.address} {/* Add detailed address */}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {product.kecamatan}, {product.kabupaten}, {product.province}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(product.id);
                onClose();
              }}
              disabled={product.quantity === 0}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-6 ${
                product.quantity === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              } transition-colors`}
            >
              <ShoppingBag className="w-5 h-5" />
              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Category filter
      if (
        selectedCategory !== "All" &&
        product.category_name !== selectedCategory
      ) {
        return false;
      }

      // Location filters - Case insensitive comparison
      if (
        selectedProvince &&
        product.province?.toLowerCase() !== selectedProvince.toLowerCase()
      ) {
        return false;
      }
      if (
        selectedRegency &&
        product.kabupaten?.toLowerCase() !== selectedRegency.toLowerCase()
      ) {
        return false;
      }
      if (
        selectedDistrict &&
        product.kecamatan?.toLowerCase() !== selectedDistrict.toLowerCase()
      ) {
        return false;
      }

      // Search query
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "Price: Low to High":
          return (a.discount_price || a.price) - (b.discount_price || b.price);
        case "Price: High to Low":
          return (b.discount_price || b.price) - (a.discount_price || a.price);
        default: // Latest
          return new Date(b.expired).getTime() - new Date(a.expired).getTime();
      }
    });

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden pt-20 md:pt-28">
      {/* Header Section with gradient */}
      <section className="bg-gradient-to-b from-green-50 to-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
              <p className="text-gray-600 mt-2">
                Find great deals on quality food items
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 text-gray-700 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <motion.div
            className={`lg:w-72 bg-white p-6 rounded-2xl shadow-lg ${
              isFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="space-y-8">
              {/* Categories with icons */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Categories</h3>
                <div className="text-gray-600">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Location</h3>
                <div className="space-y-3 text-gray-700">
                  <select
                    value={selectedProvinceId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const province = provinces.find((p) => p.id === id);
                      setSelectedProvinceId(id);
                      setSelectedProvince(province ? province.name : "");
                      // Reset child selects
                      setSelectedRegencyId("");
                      setSelectedRegency("");
                      setSelectedDistrictId("");
                      setSelectedDistrict("");
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedRegencyId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const regency = regencies.find((r) => r.id === id);
                      setSelectedRegencyId(id);
                      setSelectedRegency(regency ? regency.name : "");
                      // Reset district
                      setSelectedDistrictId("");
                      setSelectedDistrict("");
                    }}
                    disabled={!selectedProvinceId}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select Regency</option>
                    {regencies.map((regency) => (
                      <option key={regency.id} value={regency.id}>
                        {regency.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDistrictId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const district = districts.find((d) => d.id === id);
                      setSelectedDistrictId(id);
                      setSelectedDistrict(district ? district.name : "");
                    }}
                    disabled={!selectedRegencyId}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enhanced Price Range */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">
                  Price Range
                </h3>
                <div className="space-y-4 text-gray-600">
                  <input
                    type="range"
                    className="w-full"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm">
                    <span>{formatPrice(0)}</span>
                    <span>{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Modern Checkboxes */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-700">Filters</h3>
                <div className="space-y-3 text-gray-600">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showExpired}
                      onChange={(e) => setShowExpired(e.target.checked)}
                      className="form-checkbox text-green-600"
                    />
                    <span>Show expired items</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="form-checkbox text-green-600"
                    />
                    <span>Only discounted</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Modern Sort Dropdown */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <span>Sort by: {selectedSort}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedSort(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors ${
                            selectedSort === option
                              ? "bg-green-50 text-green-600"
                              : ""
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Enhanced Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedProduct(product)}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative">
                    <div className="relative aspect-[4/3] bg-gray-200">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.photo}`}
                        alt={product.name}
                        fill
                        className="rounded-t-2xl object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    {isDiscountActive(product) &&
                      product.is_discount &&
                      product.discount_percentage &&
                      product.discount_percentage > 0 && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                          -{product.discount_percentage}%
                        </span>
                      )}
                    {new Date(product.expired) < new Date() && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Expired
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-sm text-gray-500">
                      {product.category_name}
                    </span>
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(
                          isDiscountActive(product)
                            ? Number(product.discount_price) ||
                                Number(product.price)
                            : Number(product.price)
                        )}
                      </span>
                      {isDiscountActive(product) &&
                        product.is_discount &&
                        product.discount_percentage &&
                        product.discount_percentage > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(Number(product.price))}
                          </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            {product.kecamatan}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.kabupaten}, {product.province}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={product.quantity === 0}
                      className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${
                        product.quantity === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      } transition-colors`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedProduct && (
              <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            )}

            {/* Enhanced Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 hover:bg-green-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
