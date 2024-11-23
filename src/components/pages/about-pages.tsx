'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Leaf, Target, ArrowRight, Award, Clock, Building } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { number: '2.5M+', label: 'Food Items Saved', icon: <Leaf className="w-6 h-6 text-green-600" /> },
    { number: '500+', label: 'Partner Businesses', icon: <Building className="w-6 h-6 text-green-600" /> },
    { number: '10k+', label: 'Active Users', icon: <Users className="w-6 h-6 text-green-600" /> },
    { number: '30%', label: 'Average Savings', icon: <Award className="w-6 h-6 text-green-600" /> }
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
              Reducing Food Waste, <span className="text-green-600">Creating Impact</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed">
              Since 2020, we&apos;ve been on a mission to transform how businesses handle food waste.
              By connecting conscious consumers with local businesses, we&apos;re building a more sustainable future for everyone.
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Journey</h2>
                <div className="space-y-6 text-gray-700">
                  <p className="leading-relaxed">
                    WasteLess started with a simple observation: local businesses were throwing away 
                    perfectly good food while many people were looking for affordable options.
                  </p>
                  <p className="leading-relaxed">
                    We built a platform that connects these businesses with conscious consumers, 
                    creating a win-win situation that reduces food waste and helps the environment.
                  </p>
                  <p className="leading-relaxed">
                    Today, we&apos;re proud to have saved millions of food items and partnered with 
                    hundreds of businesses across the country.
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
                  alt="Our Journey"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Values</h2>
            <p className="text-gray-700 leading-relaxed">
              These core values guide everything we do as we work towards our mission 
              of creating a more sustainable future.
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
                title: 'Environmental Impact',
                description: 'Every action we take is measured by its positive impact on our planet.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community First',
                description: 'We believe in building strong, lasting relationships with our partners and users.'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Continuous Innovation',
                description: 'We constantly evolve our technology to better serve our community.'
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Trusted By Industry Leaders</h2>
            <p className="text-gray-600">We&apos;re proud to work with companies that share our vision</p>
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