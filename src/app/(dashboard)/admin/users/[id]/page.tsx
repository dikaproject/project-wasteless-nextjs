"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
  address?: {
    province: string;
    kabupaten: string;
    kecamatan: string;
    code_pos: string;
    address: string;
    photo_ktp?: string;
    photo_usaha?: string;
  };
}

export default function UserDetail() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
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
        setUser({
          ...data.data.user,
          address: data.data.address
        });
      }
    } catch (error) {
      toast.error("Failed to fetch user");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/reset/${params.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Password reset successfully");
      }
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  if (loading) return <div className="text-gray-600">Loading...</div>;
  if (!user) return <div className="text-gray-600">User not found</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <Link
          href={`/admin/users/${params.id}/edit`}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-700"
        >
          <Edit className="w-5 h-5" />
          Edit User
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Details</h1>
        
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Address Details */}
          {user.address && (
            <>
              <hr className="my-6" />
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Address Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Province
                  </label>
                  <p className="text-gray-900">{user.address.province}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Regency
                  </label>
                  <p className="text-gray-900">{user.address.kabupaten}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    District
                  </label>
                  <p className="text-gray-900">{user.address.kecamatan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Postal Code
                  </label>
                  <p className="text-gray-900">{user.address.code_pos}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Full Address
                  </label>
                  <p className="text-gray-900">{user.address.address}</p>
                </div>
              </div>
            </>
          )}

          {/* Seller Documents */}
          {user.role === 'seller' && user.address && (
            <>
              <hr className="my-6" />
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Seller Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.address.photo_ktp && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      KTP Photo
                    </label>
                    <div className="relative h-[200px] border rounded-lg overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/ktp/${user.address.photo_ktp}`}
                        alt="KTP"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                {user.address.photo_usaha && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Business Photo
                    </label>
                    <div className="relative h-[200px] border rounded-lg overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/usaha/${user.address.photo_usaha}`}
                        alt="Business"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="pt-6">
            <button
              onClick={handleResetPassword}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}