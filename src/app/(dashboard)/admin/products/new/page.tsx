// src/app/(dashboard)/admin/products/new/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Category } from "@/types/product";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    quantity: "",
    massa: "",
    expired: "",
    is_active: true,
    photo: null as File | null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file: File | undefined) => {
    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        toast.error("Please upload only JPG, JPEG or PNG images");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("massa", formData.massa);
      formDataToSend.append("expired", formData.expired);
      formDataToSend.append("is_active", String(formData.is_active));
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Create product error:", error);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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
        <h1 className="text-2xl text-gray-600 font-bold mb-6">New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

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
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="massa"
              className="block text-sm font-medium text-gray-700"
            >
              Mass
            </label>
            <input
              type="text"
              id="massa"
              name="massa"
              value={formData.massa}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          {/* Image Upload */}
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl transition-colors duration-200 
      ${
        imagePreview ? "border-green-500 bg-green-50" : "hover:border-gray-400"
      }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="space-y-2 text-center">
              {imagePreview ? (
                <div className="relative group">
                  <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, photo: null }));
                      }}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to change image
                  </p>
                </div>
              ) : (
                <>
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <Upload className="mx-auto h-12 w-12" strokeWidth={1.5} />
                  </div>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="photo"
                      className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                      Maximum 5MB
                    </span>
                    <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                      JPG, PNG only
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="expired"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date
            </label>
            <input
              type="date"
              id="expired"
              name="expired"
              value={formData.expired}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded text-gray-600 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-700"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Creating..." : "Create Product"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
