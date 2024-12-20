"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

const HowToOrderSection = () => {
  const steps = [
    {
      number: "01",
      title: "Telusuri Produk",
      description: "Jelajahi berbagai produk kami dari bisnis lokal",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      number: "02",
      title: "Tambahkan ke Keranjang",
      description: "Pilih barang Anda dan tambahkan ke keranjang belanja Anda",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      number: "03",
      title: "Pembayaran",
      description: "Selesaikan pembelian Anda dengan sistem pembayaran aman kami",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      number: "04",
      title: "Ambil / Pengiriman",
      description: "Pilih antara pengambilan atau pengiriman untuk menerima barang Anda",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-green-600 font-medium mb-4 inline-block"
          >
            Pemesanan
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6"
          >
            Pesan dalam 4 Langkah Sederhana
          </motion.h2>
        </div>

        <div className="grid text-gray-700 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-100 text-green-600 mb-4 md:mb-6">
                  {step.icon}
                </div>
                <span className="block text-3xl md:text-4xl font-bold text-green-600 mb-2 md:mb-4">
                  {step.number}
                </span>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-green-200 transform -translate-y-1/2">
                  <ArrowRight className="absolute right-0 -top-2 text-green-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToOrderSection;
