'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Clock, ShoppingBag, Recycle } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      title: "Kurangi Limbah Makanan",
      description: "Bantu bisnis F&B lokal mengurangi limbah makanan sambil mendapatkan produk berkualitas dengan harga lebih baik.",
      bgColor: "bg-green-600",
      stats: "2.5M+ item diselamatkan"
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Stok Cerdas",
      description: "Sistem manajemen Stok yang efisien untuk bisnis lokal untuk melacak dan mengelola produk mereka.",
      bgColor: "bg-blue-600",
      stats: "500+ bisnis"
    },
    {
      icon: <Recycle className="w-6 h-6 text-white" />,
      title: "Transformasi Digital",
      description: "Mendukung UKM tradisional dalam perjalanan mereka menuju transformasi digital.",
      bgColor: "bg-purple-600",
      stats: "98% tingkat keberhasilan"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-green-600 font-medium mb-4 inline-block"
          >
            TENTANG WASTELESS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6"
          >
            Mengubah Limbah Makanan Menjadi Peluang
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-600"
          >
            Bergabunglah dengan misi kami untuk menciptakan masa depan yang berkelanjutan sambil mendukung bisnis lokal
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform group-hover:-translate-y-2 transition-all duration-300" />
              <div className="relative p-6 md:p-8 rounded-2xl bg-white">
              <div className={`${feature.bgColor} w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  {feature.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;