"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const quickLinks = [
    { name: "Tentang Kami", href: "/about" },
    { name: "Produk", href: "/marketplace" },
    { name: "Untuk UMKM", href: "/business" },
    { name: "Keranjang Belanja", href: "/cart" },
    { name: "Kontak", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Syarat Layanan", href: "/terms" },
    { name: "Kebijakan Privasi", href: "/privacy" },
    { name: "Kebijakan Cookie", href: "/cookies" },
    { name: "FAQ", href: "/faq" },
  ];

  const checkSubscription = async (email: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/check/${email}`
      );
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error("Check subscription error:", error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsSubscribed(true);
        setEmail("");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to subscribe"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      toast.error("Email is required for unsubscribing");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/unsubscribe/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsSubscribed(false);
        setEmail("");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unsubscribe"
      );
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Konten Utama Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Info Perusahaan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link href="/" className="block">
              <Image
                src="/images/logo-wasteless.png"
                alt="WasteLess Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-sm">
              Bergabunglah dengan kami dalam misi mengurangi limbah makanan dan
              menciptakan masa depan yang berkelanjutan untuk semua.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-green-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-green-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-green-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Tautan Cepat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-white text-lg font-semibold">Tautan Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center group hover:text-green-400 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info Kontak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-white text-lg font-semibold">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-green-400" />
                <span>
                  Jl. DI Panjaitan No.128, Karangreja, Purwokerto Kidul
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span>+62 812-2784-8422</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span>intechofficialteam@gmail.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="space-y-6">
            <h3 className="text-white text-lg font-semibold">Newsletter</h3>
            {isSubscribed ? (
              <div className="space-y-4">
                <p className="text-sm text-green-400">
                  Terima kasih telah berlangganan newsletter kami! 🎉
                </p>
                <button
                  onClick={handleUnsubscribe}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  Berhenti berlangganan
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm">
                  Berlangganan Newsletter kami untuk tips mengurangi limbah
                  makanan dan penawaran eksklusif.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email Anda"
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-600"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Kirim"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bar Bawah */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              © {new Date().getFullYear()} WasteLess. Copyright InTech.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm hover:text-green-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
