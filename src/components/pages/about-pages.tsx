'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Leaf, Target, ArrowRight, Award, Clock, Building } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { number: '2.5M+', label: 'Makanan Terselamatkan', icon: <Leaf className="w-6 h-6 text-green-600" /> },
    { number: '500+', label: 'Bisnis Mitra', icon: <Building className="w-6 h-6 text-green-600" /> },
    { number: '10k+', label: 'Pengguna Aktif', icon: <Users className="w-6 h-6 text-green-600" /> },
    { number: '30%', label: 'Penghematan Rata-rata', icon: <Award className="w-6 h-6 text-green-600" /> }
  ];

  const partners = [
    { name: 'Gojek', logo: '/logos/gojek.png' },
    { name: 'Google', logo: '/logos/google.png' },
    { name: 'Tokopedia', logo: '/logos/tokopedia.png' },
    { name: 'Grab', logo: '/logos/grab.png' },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden pt-20 md:pt-28">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Mengurangi Limbah Makanan, <span className="text-green-600">Menciptakan Peluang</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed">
              Sejak 2024, kami telah menjalankan misi untuk mengubah cara bisnis menangani limbah makanan.
              Dengan menghubungkan konsumen yang sadar dengan bisnis lokal, kami membangun masa depan yang lebih berkelanjutan untuk semua orang.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Perjalanan Kami</h2>
                <div className="space-y-6 text-gray-700">
                  <p className="leading-relaxed">
                    WasteLess dimulai dengan pengamatan sederhana: bisnis lokal membuang makanan yang masih layak 
                    sementara banyak orang mencari opsi yang terjangkau.
                  </p>
                  <p className="leading-relaxed">
                    Kami membangun platform yang menghubungkan bisnis ini dengan konsumen yang sadar, 
                    menciptakan situasi win-win yang mengurangi limbah makanan dan membantu lingkungan.
                  </p>
                  <p className="leading-relaxed">
                    Hari ini, kami bangga telah menyelamatkan jutaan item makanan dan bermitra dengan 
                    ratusan bisnis di seluruh negeri.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Image
                  src="/hero-section.jpg"
                  alt="Perjalanan Kami"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Nilai-Nilai Kami</h2>
            <p className="text-gray-700 leading-relaxed">
              Nilai-nilai inti ini membimbing segala sesuatu yang kami lakukan saat kami bekerja menuju misi kami 
              untuk menciptakan masa depan yang lebih berkelanjutan.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: 'Dampak Lingkungan',
                description: 'Setiap tindakan yang kami ambil diukur dengan dampak positifnya terhadap planet kita.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Komunitas Utama',
                description: 'Kami percaya dalam membangun hubungan yang kuat dan langgeng dengan mitra dan pengguna kami.'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Inovasi Berkelanjutan',
                description: 'Kami terus mengembangkan teknologi kami untuk melayani komunitas kami dengan lebih baik.'
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Dipercaya oleh Pemimpin Industri</h2>
            <p className="text-gray-600">Kami bangga bekerja dengan perusahaan yang berbagi visi kami</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-4xl mx-auto">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center p-6"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={40}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  priority
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;