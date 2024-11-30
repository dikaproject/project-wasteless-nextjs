// components/auth/RegisterForm.tsx
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader, Phone, Image } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: 'user' | 'seller';
  photo_ktp: File | null;
  photo_usaha: File | null;
}

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user',
    photo_ktp: null,
    photo_usaha: null
  });
  const [photoKtpPreview, setPhotoKtpPreview] = useState<string | null>(null);
  const [photoUsahaPreview, setPhotoUsahaPreview] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: 'photo_ktp' | 'photo_usaha'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'photo_ktp') {
          setPhotoKtpPreview(reader.result as string);
        } else {
          setPhotoUsahaPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    // Additional validation for seller
    if (formData.role === 'seller') {
      if (!formData.photo_ktp) {
        toast.error('Please upload Photo KTP');
        return false;
      }
      if (!formData.photo_usaha) {
        toast.error('Please upload Photo Usaha');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('role', formData.role);

      if (formData.role === 'seller') {
        if (formData.photo_ktp) {
          formDataToSend.append('photo_ktp', formData.photo_ktp);
        }
        if (formData.photo_usaha) {
          formDataToSend.append('photo_usaha', formData.photo_usaha);
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          formData.role === 'seller'
            ? 'Registration successful! Please wait for admin approval.'
            : 'Registration successful!'
        );
        router.push('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 pt-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 text-center">Create an account</h2>
          <p className="mt-2 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 text-gray-600 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Full name"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 text-gray-600 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Email address"
              />
            </div>

            {/* Phone Input */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 text-gray-600 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Phone number"
              />
            </div>

            {/* Role Selection */}
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-4 text-gray-600 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="user">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* Password Fields */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 text-gray-600 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 text-gray-600 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Confirm password"
              />
            </div>

            {/* Conditional Fields for Seller */}
            <AnimatePresence>
              {formData.role === 'seller' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {/* Photo KTP */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Photo KTP
                    </label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'photo_ktp')}
                        className="w-full text-gray-600 py-2"
                      />
                    </div>
                    {photoKtpPreview && (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={photoKtpPreview}
                        alt="Photo KTP Preview"
                        className="mt-2 w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </motion.div>

                  {/* Photo Usaha */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Photo Usaha
                    </label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'photo_usaha')}
                        className="w-full text-gray-600 py-2"
                      />
                    </div>
                    {photoUsahaPreview && (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={photoUsahaPreview}
                        alt="Photo Usaha Preview"
                        className="mt-2 w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterForm;