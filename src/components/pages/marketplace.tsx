'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Star, Clock, Check, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

const MarketplacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Latest');

  const categories = ['All', 'Vegetables', 'Fruits', 'Bakery', 'Dairy', 'Ready Meals'];
  const sortOptions = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

  const products = [
    {
      id: 1,
      name: "Fresh Vegetables Bundle",
      price: 15.99,
      originalPrice: 25.99,
      image: "/images/vegetables.jpg",
      category: "Vegetables",
      isExpired: false,
      discount: "38%",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Organic Fruits Pack",
      price: 12.99,
      originalPrice: 22.99,
      image: "/images/fruits.png",
      category: "Fruits",
      isExpired: true,
      expiryDate: "2 days",
      discount: "43%",
      rating: 4.5,
      reviews: 89,
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header Section with gradient */}
      <section className="bg-gradient-to-b from-green-50 to-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
              <p className="text-gray-600 mt-2">Find great deals on quality food items</p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
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
            className={`lg:w-72 bg-white p-6 rounded-2xl shadow-lg ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
          >
            <div className="space-y-8">
              {/* Categories with icons */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-green-50 text-green-600 font-medium shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Price Range */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Price Range</h3>
                <input
                  type="range"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  min="0"
                  max="100"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$0</span>
                  <span>$100</span>
                </div>
              </div>

              {/* Modern Checkboxes */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-800">Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-gray-700 hover:text-gray-900 cursor-pointer group">
                    <div className="relative w-5 h-5">
                      <input type="checkbox" className="peer hidden" />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors peer-checked:border-green-500 peer-checked:bg-green-500" />
                      <Check className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="group-hover:text-gray-900">Show expired items</span>
                  </label>
                  <label className="flex items-center gap-3 text-gray-700 hover:text-gray-900 cursor-pointer group">
                    <div className="relative w-5 h-5">
                      <input type="checkbox" className="peer hidden" />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors peer-checked:border-green-500 peer-checked:bg-green-500" />
                      <Check className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="group-hover:text-gray-900">Only discounted</span>
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
                  <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
                            selectedSort === option ? 'bg-green-50 text-green-600' : ''
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
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative">
                <div className="relative aspect-[4/3] bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="rounded-t-2xl object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {product.discount && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                    -{product.discount}
                  </span>
                )}
                {product.isExpired && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {product.expiryDate}
                  </div>
                )}
              </div>

                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 group">
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                    page === 1
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;