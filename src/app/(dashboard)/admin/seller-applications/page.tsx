"use client";
import { useState, useEffect } from "react";
import { Loader2, Check, X, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface PendingSeller {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo_ktp: string;
  photo_usaha: string;
}

export default function SellerApplications() {
  const [sellers, setSellers] = useState<PendingSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<PendingSeller | null>(
    null
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/pending-sellers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSellers(data.data);
      }
    } catch (err) {
      toast.error("Failed to load seller applications");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reject-seller/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Seller application rejected");
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedSellerId(null);
        fetchPendingSellers();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error("Failed to reject seller");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/approve-seller/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Seller approved successfully");
        fetchPendingSellers();
      }
    } catch (err) {
      toast.error("Failed to approve seller");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Seller Applications
        </h1>
        <p className="text-gray-600">Review and approve seller applications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller) => (
          <div key={seller.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{seller.name}</h3>
                <p className="text-sm text-gray-500">{seller.email}</p>
                <p className="text-sm text-gray-500">{seller.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">KTP</p>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${seller.photo_ktp}`}
                    alt="KTP"
                    width={150}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Business Photo</p>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${seller.photo_usaha}`}
                    alt="Business"
                    width={150}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleApprove(seller.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedSellerId(seller.id);
                    setShowRejectModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4">
                Reject Seller Application
              </h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full p-2 border rounded-lg mb-4"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setSelectedSellerId(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    selectedSellerId && handleReject(selectedSellerId)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {sellers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No pending seller applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
