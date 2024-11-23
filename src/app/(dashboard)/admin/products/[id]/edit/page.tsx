"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import toast from "react-hot-toast";
import { Product, Category } from "@/types/product";
import Image from "next/image";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldPhoto, setOldPhoto] = useState<string | null>(null);
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Update formData state initialization
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    slug: "",
    quantity: "",
    massa: "",
    expired: "",
    is_active: true,
    photo: null as File | null,
    price: "",
    is_discount: false,
    discount_percentage: "",
    discount_price: "",
    start_date: "",
    end_date: "",
  });

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

  // Update useEffect to populate form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const [categoriesResponse, productResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${params.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const [categoriesData, productData] = await Promise.all([
          categoriesResponse.json(),
          productResponse.json(),
        ]);

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        if (productData.success && productData.data) {
          const product = productData.data;
          setFormData({
            category_id: product.category_id.toString(),
            name: product.name,
            slug: product.slug,
            quantity: product.quantity.toString(),
            massa: product.massa,
            expired: product.expired.split("T")[0],
            is_active: product.is_active,
            photo: null,
            price: product.price?.toString() || "",
            is_discount: product.is_discount || false,
            discount_percentage: product.discount_percentage?.toString() || "",
            discount_price: product.discount_price?.toString() || "",
            start_date: product.start_date
              ? product.start_date.split("T")[0]
              : "",
            end_date: product.end_date ? product.end_date.split("T")[0] : "",
          });

          if (product.photo) {
            setOldPhoto(product.photo);
            setImagePreview(
              `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.photo}`
            );
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch data");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("massa", formData.massa);
      formDataToSend.append("expired", formData.expired);
      formDataToSend.append("is_active", String(formData.is_active));

      // Add photo if changed
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
        // Add old photo info for cleanup
        if (oldPhoto) {
          formDataToSend.append("old_photo", oldPhoto);
        }
      }

      // Add prices data
      const priceData = [
        {
          price: Number(formData.price.replace(/\D/g, "")),
          is_discount: formData.is_discount,
          discount_percentage: formData.is_discount
            ? Number(formData.discount_percentage)
            : 0,
          discount_price: formData.is_discount
            ? Number(formData.discount_price)
            : 0,
          start_date: formData.is_discount ? formData.start_date : null,
          end_date: formData.is_discount ? formData.end_date : null,
        },
      ];
      formDataToSend.append("prices", JSON.stringify(priceData));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${params.id}`,
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
        toast.success("Product updated successfully");
        router.push("/admin/products");
      } else {
        throw new Error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update handleChange to include price formatting and slug generation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value),
      }));
    } else if (name === "price") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        price: numericValue,
        discount_price: prev.is_discount
          ? String(
              Number(numericValue) *
                (1 - Number(prev.discount_percentage) / 100)
            )
          : "",
      }));
    } else if (name === "discount_percentage" && formData.is_discount) {
      const percentage = Number(value);
      setFormData((prev) => ({
        ...prev,
        discount_percentage: value,
        discount_price: String(Number(prev.price) * (1 - percentage / 100)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  if (loading) return <div className="text-gray-600">Loading...</div>;

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
        <h1 className="text-2xl text-gray-600 font-bold mb-6">Edit Product</h1>
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
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
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
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
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
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
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
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          {/* Price field */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full pl-12 text-gray-600 rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Discount toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_discount"
              name="is_discount"
              checked={formData.is_discount}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor="is_discount"
              className="ml-2 block text-sm text-gray-700"
            >
              Add Discount
            </label>
          </div>

          {/* Discount fields */}
          {formData.is_discount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="discount_percentage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount_percentage"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="mt-1 block w-full text-gray-600 rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </motion.div>
          )}

          {/* Photo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            </div>
            {imagePreview && (
              <div className="mt-2 relative w-24 h-24 group">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
                {/* Add remove photo button */}
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, photo: null }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
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
              className="mt-1 block text-gray-600 w-full rounded-md border border-gray-300 px-3 py-2"
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
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
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
              {loading ? "Updating..." : "Update Product"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
