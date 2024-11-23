import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/components/providers/loading-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WasteLess",
  description: "Reduce food waste with WasteLess",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
