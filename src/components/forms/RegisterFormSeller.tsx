// components/forms/RegisterFormSeller.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Store,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  province: string;
  kabupaten: string;
  kecamatan: string;
  address: string;
  code_pos: string;
  photo_ktp: File | null;
  photo_usaha: File | null;
  province_id: string;
  regency_id: string;
  district_id: string;
}

export default function RegisterFormSeller() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const usahaInputRef = useRef<HTMLInputElement>(null);
  const [ktpPreview, setKtpPreview] = useState<string>("");
  const [usahaPreview, setUsahaPreview] = useState<string>("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedRegencyId, setSelectedRegencyId] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    province: "",
    kabupaten: "",
    kecamatan: "",
    address: "",
    code_pos: "",
    photo_ktp: null,
    photo_usaha: null,
    province_id: "",
    regency_id: "",
    district_id: "",
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
        regency_id: "",
        district_id: "",
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
        district_id: "",
      }));
    }
  }, [selectedRegencyId]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("/api/proxy-location?type=provinces");
      const data = await response.json();
      setProvinces(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Gagal memuat data provinsi");
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
      toast.error("Gagal memuat data kabupaten");
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
      toast.error("Gagal memuat data kecamatan");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (e.target.name === "photo_ktp") {
          setKtpPreview(reader.result as string);
        } else {
          setUsahaPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: file,
      }));
    }
  };

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email tidak valid");
      return false;
    }

    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Nomor telepon tidak valid");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.province || !formData.kabupaten || !formData.kecamatan) {
      toast.error("Mohon lengkapi data lokasi");
      return false;
    }

    if (!formData.photo_ktp || !formData.photo_usaha) {
      toast.error("Foto KTP dan foto usaha wajib diupload");
      return false;
    }

    if (!formData.photo_ktp || !formData.photo_usaha) {
      toast.error("Foto KTP dan foto usaha wajib diupload");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }

    if (!validateStep2()) return;

    setLoading(true);
    const formDataToSend = new FormData();

    // Log data being sent
    console.log("Sending data:", formData);

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && key !== "confirmPassword") {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register-seller`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Pendaftaran berhasil! Tim kami akan meninjau aplikasi Anda."
        );
        router.push("/login");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendaftar"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-8 text-gray-700"
    >
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="pl-10 w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="pl-10 w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="pl-10 w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="pl-10 w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan ulang password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="pl-10 w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center gap-2"
              >
                Selanjutnya
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
                    <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Location Fields */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provinsi
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
                        province_id: id,
                      }));
                    }}
                    className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
          
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kabupaten/Kota
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
                        regency_id: id,
                      }));
                    }}
                    disabled={!selectedProvinceId}
                    className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Pilih Kabupaten</option>
                    {regencies.map((regency) => (
                      <option key={regency.id} value={regency.id}>
                        {regency.name}
                      </option>
                    ))}
                  </select>
                </div>
          
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        district_id: id,
                      }));
                    }}
                    disabled={!selectedRegencyId}
                    className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
          
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="code_pos"
                    required
                    value={formData.code_pos}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        code_pos: e.target.value,
                      }))
                    }
                    className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan kode pos"
                  />
                </div>
              </div>
          
              {/* Full Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>
          
              {/* Photo Upload Section */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* KTP Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto KTP
                  </label>
                  <div
                    onClick={() => ktpInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-green-500 transition-colors h-[200px] sm:h-[240px]"
                  >
                    <input
                      type="file"
                      name="photo_ktp"
                      ref={ktpInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {ktpPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={ktpPreview}
                          alt="KTP Preview"
                          fill
                          className="rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Klik untuk upload KTP</p>
                      </div>
                    )}
                  </div>
                </div>
          
                {/* Business Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Usaha
                  </label>
                  <div
                    onClick={() => usahaInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-green-500 transition-colors h-[200px] sm:h-[240px]"
                  >
                    <input
                      type="file"
                      name="photo_usaha"
                      ref={usahaInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {usahaPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={usahaPreview}
                          alt="Usaha Preview"
                          fill
                          className="rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Klik untuk upload foto usaha</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          
            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4">
              <motion.button
                type="button"
                onClick={() => setStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  <>
                    Daftar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
