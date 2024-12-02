// address-form.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

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

const AddressForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");

  const [addressData, setAddressData] = useState({
    kabupaten: "",
    kecamatan: "",
    address: "",
    code_pos: "",
  });

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchRegencies(selectedProvince);
      setRegencies([]);
      setDistricts([]);
      setAddressData((prev) => ({ ...prev, kabupaten: "", kecamatan: "" }));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedRegency) {
      fetchDistricts(selectedRegency);
      setDistricts([]);
      setAddressData((prev) => ({ ...prev, kecamatan: "" }));
    }
  }, [selectedRegency]);

    const fetchProvinces = async () => {
    try {
      const response = await fetch('/api/proxy-location?type=provinces');
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      toast.error("Failed to load provinces");
    }
  };
  
  const fetchRegencies = async (provinceId: string) => {
    try {
      const response = await fetch(`/api/proxy-location?type=regencies&id=${provinceId}`);
      const data = await response.json();
      setRegencies(data);
    } catch (error) {
      toast.error("Failed to load regencies");
    }
  };
  
  const fetchDistricts = async (regencyId: string) => {
    try {
      const response = await fetch(`/api/proxy-location?type=districts&id=${regencyId}`);
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      toast.error("Failed to load districts");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (e.target.name === "province") {
      setSelectedProvince(e.target.value);
    } else if (e.target.name === "regency") {
      const regency = regencies.find((r) => r.id === e.target.value);
      setSelectedRegency(e.target.value);
      setAddressData((prev) => ({
        ...prev,
        kabupaten: regency?.name || "",
      }));
    } else if (e.target.name === "district") {
      const district = districts.find((d) => d.id === e.target.value);
      setAddressData((prev) => ({
        ...prev,
        kecamatan: district?.name || "",
      }));
    } else {
      setAddressData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/address`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(addressData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Address updated successfully!");
        router.push("/"); // Redirect to home after success
      } else {
        toast.error(data.message || "Failed to update address");
      }
    } catch (error) {
      toast.error("Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg"
      >
        <div>
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
            Complete Your Address
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Please provide your delivery address details
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700"
              >
                Province
              </label>
              <select
                id="province"
                name="province"
                required
                value={selectedProvince}
                onChange={handleChange}
                className="mt-1 block text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <label
                htmlFor="regency"
                className="block text-sm font-medium text-gray-700"
              >
                Kabupaten
              </label>
              <select
                id="regency"
                name="regency"
                required
                value={selectedRegency}
                onChange={handleChange}
                disabled={!selectedProvince}
                className="mt-1 block text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                Kecamatan
              </label>
              <select
                id="district"
                name="district"
                required
                onChange={handleChange}
                disabled={!selectedRegency}
                className="mt-1 block text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Full Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={addressData.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your detailed address"
              />
            </div>

            <div>
              <label
                htmlFor="code_pos"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                id="code_pos"
                name="code_pos"
                type="text"
                required
                value={addressData.code_pos}
                onChange={handleChange}
                className="mt-1 block text-gray-700 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter postal code"
                pattern="[0-9]*"
                maxLength={5}
              />
            </div>
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
                Updating...
              </>
            ) : (
              "Save Address"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddressForm;
