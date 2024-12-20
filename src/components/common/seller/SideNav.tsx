"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ChevronLeft,
  LogOut,
  Menu,
  X,
  Home
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/seller",
    },
    {
      title: "Produk",
      icon: <Package className="w-5 h-5" />,
      path: "/seller/products",
    },
    {
      title: "Order",
      icon: <ClipboardList className="w-5 h-5" />,
      path: "/seller/orders",
    },
    {
      title: "Beranda",
      icon: <Home className="w-5 h-5" />,
      path: "/",
    }
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-xl shadow-lg transition-all duration-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen ? 0 : window?.innerWidth < 1024 ? -280 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-xl z-40"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 flex items-center justify-between border-b border-gray-100">
            <Link href="/seller" className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
      <Image 
        src="/images/logo.png"
        alt="WasteLess Logo"
        width={36}
        height={36}
        className="object-contain"
      />
    </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"
                  >
                    WasteLess
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.div>
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <motion.li
                    key={item.path}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? "bg-green-50 text-green-600 font-medium shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      {item.icon}
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all duration-200
                ${isCollapsed ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}