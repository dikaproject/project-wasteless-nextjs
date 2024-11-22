"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Leaf,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ProductSection = () => {
  const products = [
    {
      id: 1,
      name: "Fresh Vegetables Bundle",
      price: 15.99,
      originalPrice: 25.99,
      image: "/images/vegetables.jpg",
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
      isExpired: true,
      expiryDate: "2 days",
      discount: "43%",
      rating: 4.5,
      reviews: 89,
      fertilizer: true,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-green-600 font-medium mb-2 md:mb-4 block text-sm md:text-base"
            >
              OUR PRODUCTS
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800"
            >
              Featured Items
            </motion.h2>
          </div>
          <div className="flex gap-2 self-end">
            <button className="p-2 rounded-full bg-white shadow-lg hover:bg-green-50 transition-colors">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button className="p-2 rounded-full bg-white shadow-lg hover:bg-green-50 transition-colors">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
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

              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-400">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <span className="text-xl md:text-2xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {product.fertilizer && (
                    <div className="flex items-center gap-2 mb-4 text-sm bg-green-50 text-green-600 p-2 rounded-lg">
                      <Leaf className="w-4 h-4" />
                      Suitable for composting
                    </div>
                  )}
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
