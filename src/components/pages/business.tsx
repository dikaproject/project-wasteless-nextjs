"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Store,
  TrendingUp,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const BusinessPage = () => {
  const router = useRouter();
  const benefits = [
    {
      icon: <Store className="w-6 h-6" />,
      title: "Jangkau Lebih Banyak Pelanggan",
      description:
        "Terhubung dengan konsumen yang sedang mencari makanan berkualitas dengan harga lebih murah",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Kurangi Limbah",
      description:
        "Ubah potensi kerugian menjadi keuntungan dengan menjual barang yang mendekati kadaluarsa",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Manajemen Efisien",
      description: "Platform yang mudah digunakan untuk mengelola stok dan pesanan",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Daftarkan Bisnis Anda",
      description:
        "Lengkapi formulir pendaftaran online kami yang sederhana dan verifikasi bisnis Anda",
    },
    {
      number: "02",
      title: "Daftarkan Produk Anda",
      description: "Tambahkan produk Anda dengan foto, harga, dan tanggal kadaluarsa",
    },
    {
      number: "03",
      title: "Mulai Menjual",
      description:
        "Terima pesanan dan kelola stok Anda melalui platform kami",
    },
  ];

  const faqs = [
    {
      question: "Berapa biaya untuk bergabung?",
      answer:
        "Pendaftaran gratis. Kami hanya mengambil komisi kecil dari penjualan yang berhasil.",
    },
    {
      question: "Jenis produk apa yang bisa saya jual?",
      answer:
        "Semua jenis makanan termasuk hasil bumi segar, roti, makanan siap saji, dan lainnya.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden pt-20 md:pt-28">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:w-1/2 space-y-6"
            >
              <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                Untuk Mitra Bisnis
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Kembangkan Bisnis Anda, <br />
                <span className="text-green-600">Kurangi Limbah Makanan</span>
              </h1>
              <p className="text-lg text-gray-600">
                Bergabunglah dengan WasteLess dan ubah inventaris berlebih Anda menjadi keuntungan sambil memberikan dampak positif pada lingkungan
              </p>
              <motion.button
                onClick={() => router.push("/register")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition shadow-lg flex items-center gap-2"
              >
                Mulai Sekarang
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:w-1/2"
            >
              <Image
                src="/hero-section.jpg"
                alt="Mitra Bisnis"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Mengapa Bermitra dengan WasteLess?
            </h2>
            <p className="text-gray-600">
              Bergabunglah dengan ratusan bisnis yang sudah mendapatkan manfaat dari platform kami
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Cara Memulai
            </h2>
            <p className="text-gray-600">
              Langkah-langkah sederhana untuk mulai menjual di WasteLess
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-2xl shadow-lg relative z-10">
                  <span className="text-4xl font-bold text-green-600/20">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-green-200 -translate-y-1/2 z-0">
                    <ArrowRight className="absolute right-0 -top-2 text-green-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-2xl"
              >
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap untuk Memulai?
            </h2>
            <p className="text-green-100 mb-8">
              Bergabunglah dengan komunitas mitra bisnis kami yang terus berkembang dan mulailah membuat perbedaan
            </p>
            <motion.button
              onClick={() => router.push("/register")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition shadow-lg inline-flex items-center gap-2"
            >
              Daftar Sekarang
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BusinessPage;
