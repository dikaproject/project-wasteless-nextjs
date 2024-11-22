"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TestimonialSection = () => {
  const testimonials = [
    {
      author: "Sarah Johnson",
      role: "Restaurant Owner",
      content:
        "WasteLess has completely transformed how we manage our inventory. We've reduced waste by 60% and increased profits!",
      image: "/cantikku.jpeg",
      rating: 5,
      stats: "60% waste reduction",
    },
    {
      author: "Michael Chen",
      role: "Cafe Manager",
      content:
        "The platform is incredibly easy to use and has helped us connect with conscious consumers. It's a win-win situation.",
      image: "/cantikku.jpeg",
      rating: 5,
      stats: "40% profit increase",
    },
    {
      author: "Emma Davis",
      role: "Regular Customer",
      content:
        "I love being able to get quality food at great prices while helping reduce food waste. The service is amazing!",
      image: "/cantikku.jpeg",
      rating: 5,
      stats: "30% savings",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-green-50">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply blur-xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply blur-xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm md:text-base text-green-600 font-medium mb-4 inline-block px-4 py-1.5 bg-green-50 rounded-full"
          >
            TESTIMONIALS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of satisfied users who are making a difference
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="relative p-4 md:p-0"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
                {/* Quote Icon */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>

                {/* Stats Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-green-50 px-3 py-1 rounded-full text-sm font-medium text-green-600">
                    {testimonial.stats}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4 md:mb-6">
                  <p className="text-sm md:text-base text-gray-600 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>

                {/* Author Info and Rating Container */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
              <span className="text-sm md:text-base text-gray-600">
                4.9/5 rating
              </span>
            </div>
            <div className="hidden md:block text-gray-600">|</div>
            <div className="text-sm md:text-base text-gray-600">
              1000+ reviews
            </div>
            <div className="hidden md:block text-gray-600">|</div>
            <div className="text-sm md:text-base text-gray-600">
              500+ businesses
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
