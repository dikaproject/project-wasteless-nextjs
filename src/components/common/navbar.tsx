"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if auth is ready
    const token = localStorage.getItem("token");
    if (token) {
      setAuthChecked(true);
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated]);

  // Modified logout handler
  const handleLogout = async () => {
    await logout();
    router.refresh(); // Force router refresh
  };

  // Early return while checking auth
  if (!authChecked) {
    return null; // Or a loading spinner
  }

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/marketplace" },
    { name: "UMKM", href: "/business" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Cart", href: "/cart" },
    ...(isAuthenticated
      ? [{ name: "Transaction History", href: "/history" }]
      : []),
  ];

  return (
    <nav className="bg-green-600/95 backdrop-blur-sm text-white py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo remains same */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="text-2xl font-bold flex items-center gap-3"
            >
              <div className=" p-1 rounded-lg">
                <Image
                  src="/images/logo-wasteless.png"
                  alt="WasteLess Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-white font-semibold">WasteLess</span>
            </Link>
          </motion.div>

          {/* Desktop Menu remains same */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`hover:text-green-200 transition-all hover:scale-105 transform ${
                    pathname === item.href ? "text-green-200" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right side buttons with cart */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Auth Buttons */}
            <motion.div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {isAuthenticated ? (
                  <motion.div
                    key="authenticated"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4"
                  >
                    {(user?.role === "admin" || user?.role === "seller") && (
                      <Link href={user.role === "admin" ? "/admin" : "/seller"}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                        >
                          Dashboard
                        </motion.button>
                      </Link>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unauthenticated"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4"
                  >
                    <Link href="/login">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                      >
                        Login
                      </motion.button>
                    </Link>
                    <Link href="/register">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                      >
                        Register
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Button */}

            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              <motion.div
                animate={isOpen ? "open" : "closed"}
                className="space-y-2"
              >
                {[0, 1, 2].map((line) => (
                  <motion.span
                    key={line}
                    className="block w-6 h-0.5 bg-white"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open:
                        line === 1
                          ? { opacity: 0 }
                          : {
                              rotate: line === 0 ? 45 : -45,
                              y: line === 0 ? 8 : -8,
                            },
                    }}
                  />
                ))}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Add Cart Link */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-4">
                {/* Navigation Links */}
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 hover:text-green-200 transition-colors ${
                      pathname === item.href ? "text-green-200" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Auth Buttons */}
                <div className="pt-4 border-t border-green-500/30">
                  {isAuthenticated ? (
                    <>
                      {(user?.role === "admin" || user?.role === "seller") && (
                        <Link
                          href={user.role === "admin" ? "/admin" : "/seller"}
                        >
                          <button className="bg-green-700 text-white w-full px-4 py-2 rounded-lg hover:bg-green-800 transition mb-2">
                            Dashboard
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="bg-white text-green-600 w-full px-4 py-2 rounded-lg hover:bg-green-100 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <button className="bg-white text-green-600 w-full px-4 py-2 rounded-lg hover:bg-green-100 transition mb-2">
                          Login
                        </button>
                      </Link>
                      <Link href="/register">
                        <button className="bg-green-700 text-white w-full px-4 py-2 rounded-lg hover:bg-green-800 transition">
                          Register
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
