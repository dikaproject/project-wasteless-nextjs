"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { User } from "@/types/users";

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

interface District {
  id: string;
  regency_id: string;
  name: string;
}

// Update the NewUser component
export default function NewUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedRegencyId, setSelectedRegencyId] = useState("");
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
const [usahaPreview, setUsahaPreview] = useState<string | null>(null);
const ktpInputRef = useRef<HTMLInputElement>(null);
const usahaInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    province: "",
    kabupaten: "",
    kecamatan: "",
    code_pos: "",
    address: "",
  });

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      fetchRegencies(selectedProvinceId);
      setRegencies([]);
      setDistricts([]);
      setFormData((prev) => ({
        ...prev,
        kabupaten: "",
        kecamatan: "",
      }));
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedRegencyId) {
      fetchDistricts(selectedRegencyId);
      setDistricts([]);
      setFormData((prev) => ({
        ...prev,
        kecamatan: "",
      }));
    }
  }, [selectedRegencyId]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("/api/proxy-location?type=provinces");
      const data = await response.json();
      setProvinces(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load provinces");
    }
  };

  const fetchRegencies = async (provinceId: string) => {
    try {
      const response = await fetch(
        `/api/proxy-location?type=regencies&id=${provinceId}`
      );
      const data = await response.json();
      setRegencies(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load regencies");
    }
  };

  const fetchDistricts = async (regencyId: string) => {
    try {
      const response = await fetch(
        `/api/proxy-location?type=districts&id=${regencyId}`
      );
      const data = await response.json();
      setDistricts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load districts");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (e.target.name === 'photo_ktp') {
          setKtpPreview(reader.result as string);
        } else {
          setUsahaPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });
  
      // Append files if role is seller
      if (formData.role === 'seller') {
        const ktpFile = ktpInputRef.current?.files?.[0];
        const usahaFile = usahaInputRef.current?.files?.[0];
        
        if (!ktpFile || !usahaFile) {
          throw new Error('KTP and business photos are required for sellers');
        }
        
        formDataToSend.append('photo_ktp', ktpFile);
        formDataToSend.append('photo_usaha', usahaFile);
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        toast.success('User created successfully');
        router.push('/admin/users');
      } else {
        throw new Error(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl text-gray-600 font-bold mb-6">New User</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Province
              </label>
              <select
                required
                value={selectedProvinceId}
                onChange={(e) => {
                  const id = e.target.value;
                  const province = provinces.find((p) => p.id === id);
                  setSelectedProvinceId(id);
                  setFormData((prev) => ({
                    ...prev,
                    province: province?.name || "",
                  }));
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kabupaten
              </label>
              <select
                required
                value={selectedRegencyId}
                onChange={(e) => {
                  const id = e.target.value;
                  const regency = regencies.find((r) => r.id === id);
                  setSelectedRegencyId(id);
                  setFormData((prev) => ({
                    ...prev,
                    kabupaten: regency?.name || "",
                  }));
                }}
                disabled={!selectedProvinceId}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
              >
                <option value="">Select Kabupaten</option>
                {regencies.map((regency) => (
                  <option key={regency.id} value={regency.id}>
                    {regency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kecamatan
              </label>
              <select
                required
                onChange={(e) => {
                  const id = e.target.value;
                  const district = districts.find((d) => d.id === id);
                  setFormData((prev) => ({
                    ...prev,
                    kecamatan: district?.name || "",
                  }));
                }}
                disabled={!selectedRegencyId}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 disabled:bg-gray-100"
              >
                <option value="">Select Kecamatan</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="code_pos"
                value={formData.code_pos}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter detailed address..."
              required
            />
          </div>

          <AnimatePresence>
  {formData.role === 'seller' && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            KTP Photo
          </label>
          <div
            onClick={() => ktpInputRef.current?.click()}
            className="mt-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors"
          >
            <input
              type="file"
              ref={ktpInputRef}
              name="photo_ktp"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {ktpPreview ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={ktpPreview}
                  alt="KTP Preview"
                  fill
                  className="rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setKtpPreview(null);
                    if (ktpInputRef.current) {
                      ktpInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload KTP</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Photo
          </label>
          <div
            onClick={() => usahaInputRef.current?.click()}
            className="mt-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors"
          >
            <input
              type="file"
              ref={usahaInputRef}
              name="photo_usaha"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {usahaPreview ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={usahaPreview}
                  alt="Business Preview"
                  fill
                  className="rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUsahaPreview(null);
                    if (usahaInputRef.current) {
                      usahaInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload business photo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
