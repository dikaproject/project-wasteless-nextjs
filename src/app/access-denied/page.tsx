// src/app/access-denied/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function AccessDenied() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/login');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4 p-8 bg-white rounded-2xl shadow-lg text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
        >
          <AlertCircle className="w-10 h-10 text-red-600" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to access this page. Please log in with appropriate credentials.
        </p>

        <div className="text-sm text-gray-500 mb-6">
          Redirecting to login in{' '}
          <span className="font-bold text-red-600">{countdown}</span> seconds...
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/login')}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
        >
          Login Now
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}