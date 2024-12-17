// app/seller/layout.tsx
import SideNav from '@/components/common/seller/SideNav';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 pt-16 lg:pt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}