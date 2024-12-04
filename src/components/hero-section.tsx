"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Leaf, ShoppingBag, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);
  const router = useRouter();
  const taglines = [
    "Save the Planet",
    "Support Local Business",
    "Eat Sustainably",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden pt-20 md:pt-28">
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-green-500"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 relative">
        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 md:top-8 right-4 md:right-8 flex gap-2 md:gap-4 scale-90 md:scale-100"
        >
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
            <div className="text-green-600 font-bold">2.5M+</div>
            <div className="text-sm text-gray-600">Food Saved</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
            <div className="text-green-600 font-bold">500+</div>
            <div className="text-sm text-gray-600">Partners</div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium"
              >
                🌿 Eco-friendly Initiative
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Reduce Food Waste, <br />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentText}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-green-600 inline-block"
                  >
                    {taglines[currentText]}
                  </motion.span>
                </AnimatePresence>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
              >
                Join our community of conscious consumers and local businesses
                in the fight against food waste. Get great deals while making a
                positive impact.
              </motion.p>
            </div>

            <div className="container mx-auto px-4 pt-20 relative z-10"> {/* Add z-index */}
        <div className="flex gap-4">
          <motion.button
            onClick={() => router.push("/marketplace")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium relative z-10"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </motion.button>
          <motion.button
            onClick={() => router.push("/about")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition flex items-center justify-center gap-2 font-medium relative z-10"
          >
            <Sprout className="w-5 h-5" />
            Learn More
          </motion.button>
        </div>
      </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="pt-6 md:pt-8 border-t border-gray-200 hidden sm:block"
            >
              <div className="flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <Image
                      key={i}
                      src="/cantikku.jpeg"
                      alt={`User profile ${i + 1}`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      priority
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Trusted by{" "}
                  <span className="font-bold text-gray-800">10,000+</span> users
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content / Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 relative"
          >
            <div className="relative">
              {/* Background Decorative Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -z-10 inset-0 bg-gradient-to-r from-green-200 to-green-100 rounded-full blur-3xl opacity-30"
              />

              {/* Main Image */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <Image
                  src="/hero-section.jpg"
                  alt="Food Sustainability"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  x: [-5, 5, -5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-20 -top-2 -right-2 md:-top-6 md:-right-6 bg-white p-2 md:p-4 rounded-lg md:rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-medium text-gray-800">
                      CO₂ Saved
                    </div>
                    <div className="text-sm md:text-base text-green-600 font-bold">
                      1.2k tons
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [5, -5, 5],
                  x: [5, -5, 5],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-20 -bottom-2 -left-2 md:-bottom-6 md:-left-6 bg-white p-2 md:p-4 rounded-lg md:rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="text-base md:text-xl">🥗</div>
                  <div>
                    <div className="text-xs md:text-sm font-medium text-gray-800">
                      Meals Saved
                    </div>
                    <div className="text-sm md:text-base text-green-600 font-bold">
                      50k+
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
