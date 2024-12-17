"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Plus, Pencil, Send, Eye, Trash2, X, Save } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

interface Newsletter {
  id: number;
  title: string;
  content: string;
  status: "draft" | "scheduled" | "sent";
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

interface PreviewModal {
  isOpen: boolean;
  newsletter: Newsletter | null;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<PreviewModal>({
    isOpen: false,
    newsletter: null,
  });
  const [editedNewsletter, setEditedNewsletter] = useState<Partial<Newsletter>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const editorRef = useRef<any>(null);

  

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/admin/newsletters`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setNewsletters(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch newsletters");
    } finally {
      setLoading(false);
    }
  };

  const openPreviewModal = (newsletter: Newsletter) => {
    setModal({ isOpen: true, newsletter });
    setEditedNewsletter(newsletter);
    setIsPreviewMode(newsletter.status === "sent");
  };

  const handleSaveChanges = async () => {
    if (!modal.newsletter) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/admin/newsletters/${modal.newsletter.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editedNewsletter),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Newsletter updated successfully");
        setModal({ isOpen: false, newsletter: null });
        fetchNewsletters();
      }
    } catch (error) {
      toast.error("Failed to update newsletter");
    }
  };

  const handleSendDraft = async (id: number) => {
    if (!confirm("Send this newsletter now?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/admin/newsletters/${id}/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Newsletter sent successfully");
        fetchNewsletters();
      }
    } catch (error) {
      toast.error("Failed to send newsletter");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/admin/newsletters/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Newsletter deleted");
        fetchNewsletters();
      }
    } catch (error) {
      toast.error("Failed to delete newsletter");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Newsletters</h1>
        <Link
          href="/admin/newsletter/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Newsletter
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {newsletters.map((newsletter) => (
                <tr key={newsletter.id}>
                  <td className="px-6 py-4">{newsletter.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        newsletter.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : newsletter.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {newsletter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {newsletter.scheduled_at
                      ? format(
                          new Date(newsletter.scheduled_at),
                          "dd MMM yyyy, HH:mm"
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {newsletter.sent_at
                      ? format(
                          new Date(newsletter.sent_at),
                          "dd MMM yyyy, HH:mm"
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Preview button for all statuses */}
                      <button
                        onClick={() => openPreviewModal(newsletter)}
                        className="text-blue-600 hover:text-blue-800 tooltip"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Send button only for draft */}
                      {newsletter.status === "draft" && (
                        <button
                          onClick={() => handleSendDraft(newsletter.id)}
                          className="text-green-600 hover:text-green-800 tooltip"
                          title="Send Now"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      )}

                      {/* Delete for all except sent */}
                      {newsletter.status !== "sent" && (
                        <button
                          onClick={() => handleDelete(newsletter.id)}
                          className="text-red-600 hover:text-red-800 tooltip"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add Modal */}
      {modal.isOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto text-gray-700">
    <div 
      className="fixed inset-0 bg-black opacity-30" 
      onClick={() => setModal({ isOpen: false, newsletter: null })}
    />
    
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Newsletter Preview
          </h3>
          <button
            onClick={() => setModal({ isOpen: false, newsletter: null })}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <div className="w-full px-4 py-2 rounded-lg border bg-gray-50">
              {modal.newsletter?.title}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div className="prose max-w-none p-4 border rounded-lg bg-gray-50">
              {parse(DOMPurify.sanitize(modal.newsletter?.content || ""))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              To modify newsletter content, please delete this newsletter and create a new one.
              This ensures data consistency and proper email delivery tracking.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setModal({ isOpen: false, newsletter: null })}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
