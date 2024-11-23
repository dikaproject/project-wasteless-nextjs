// app/address-completed/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AddressForm from "@/components/forms/address-form";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

export default function AddressCompletedPage() {
  const { user, hasAddress } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user already has address or is admin
    if (hasAddress || user?.role === "admin") {
      router.push("/");
    }
  }, [hasAddress, user, router]);

  return (
    <>
      <Navbar />
      <div className="pt-24">
        <AddressForm />
      </div>
      
      <Footer />
    </>
  );
}
