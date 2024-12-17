"use client";

// Add imports
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

// Add interfaces
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

export default function EditUser() {
  // Add states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedRegencyId, setSelectedRegencyId] = useState("");
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [usahaPreview, setUsahaPreview] = useState<string | null>(null);
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const usahaInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  
  // Update form data state
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

  // Add useEffects for location data
  useEffect(() => {
    fetchProvinces();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      fetchRegencies(selectedProvinceId);
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedRegencyId) {
      fetchDistricts(selectedRegencyId);
    }
  }, [selectedRegencyId]);

  // Add location fetch functions
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

  // Update fetchUserData
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        const { user, address } = data.data;
        setFormData({
          ...user,
          password: "",
          province: address?.province || "",
          kabupaten: address?.kabupaten || "",
          kecamatan: address?.kecamatan || "",
          code_pos: address?.code_pos || "",
          address: address?.address || "",
        });
        
        if (address?.photo_ktp) {
          setKtpPreview(`${process.env.NEXT_PUBLIC_API_URL}/uploads/ktp/${address.photo_ktp}`);
        }
        if (address?.photo_usaha) {
          setUsahaPreview(`${process.env.NEXT_PUBLIC_API_URL}/uploads/usaha/${address.photo_usaha}`);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  // Add file handling
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

  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });

      if (formData.role === 'seller') {
        if (ktpInputRef.current?.files?.[0]) {
          formDataToSend.append('photo_ktp', ktpInputRef.current.files[0]);
        }
        if (usahaInputRef.current?.files?.[0]) {
          formDataToSend.append('photo_usaha', usahaInputRef.current.files[0]);
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${params.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("User updated successfully");
        router.push("/admin/users");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component (form JSX) same as create form but with edit values
    return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Users
        </Link>
      </div>
  
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>
  
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
  
          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regency
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
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Regency</option>
                {regencies.map((regency) => (
                  <option key={regency.id} value={regency.id}>
                    {regency.name}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                required
                onChange={(e) => {
                  const district = districts.find((d) => d.id === e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    kecamatan: district?.name || "",
                  }));
                }}
                disabled={!selectedRegencyId}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
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
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
  
          {/* Full Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
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
              rows={3}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
            />
          </div>
  
          {/* Seller Fields */}
          {formData.role === "seller" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KTP Photo
                </label>
                <div
                  onClick={() => ktpInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500"
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
                    <div className="relative h-[200px]">
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
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-[200px] flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload KTP</p>
                    </div>
                  )}
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Photo
                </label>
                <div
                  onClick={() => usahaInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500"
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
                    <div className="relative h-[200px]">
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
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-[200px] flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload business photo
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
  
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update User"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}