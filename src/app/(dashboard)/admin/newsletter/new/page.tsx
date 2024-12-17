"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, Send, Loader2, Calendar } from "lucide-react";
import Link from "next/link";

export default function NewNewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    scheduled_at: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate scheduling
      if (formData.status === 'scheduled' && !formData.scheduled_at) {
        throw new Error('Please set a schedule time');
      }

      // Create HTML content with template
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px;">
            <h1 style="color: #047857; margin-bottom: 20px;">${formData.title}</h1>
            <div style="white-space: pre-line; color: #374151;">
              ${formData.content}
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>To unsubscribe from our newsletter, <a href="${process.env.NEXT_PUBLIC_URL}/newsletter/unsubscribe" style="color: #047857;">click here</a></p>
            </div>
          </div>
        </div>
      `;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/admin/newsletters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          content: htmlContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(formData.status === 'scheduled' 
          ? "Newsletter scheduled successfully" 
          : "Newsletter created successfully"
        );
        router.push("/admin/newsletter");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create newsletter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/newsletter"
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Newsletters
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create Newsletter
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              required
              rows={10}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
              placeholder="Write your newsletter content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sending Options
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ 
                  ...prev, 
                  status: e.target.value,
                  scheduled_at: e.target.value === 'draft' ? '' : prev.scheduled_at
                }))
              }
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
            >
              <option value="draft">Save as Draft</option>
              <option value="scheduled">Schedule</option>
              <option value="sent">Send Now</option>
            </select>
          </div>

          {formData.status === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) =>
                  setFormData((prev) => ({ 
                    ...prev, 
                    scheduled_at: e.target.value 
                  }))
                }
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {formData.status === 'scheduled' ? 'Scheduling...' : 'Creating...'}
              </>
            ) : (
              <>
                {formData.status === 'scheduled' ? (
                  <>
                    <Calendar className="w-5 h-5" />
                    Schedule Newsletter
                  </>
                ) : formData.status === 'sent' ? (
                  <>
                    <Send className="w-5 h-5" />
                    Send Newsletter
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Save Draft
                  </>
                )}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}