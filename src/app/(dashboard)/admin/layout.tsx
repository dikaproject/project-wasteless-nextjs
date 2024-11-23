'use client';
import Sidebar from '@/components/common/sidebar';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { isLoading, isAuthenticated } = useAuth('admin');
  
    if (isLoading) {
      return <Loading />;
    }
  
    if (!isAuthenticated) {
      return null;
    }
    
  return (
    <>
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="lg:ml-[280px] ml-0"> 
        <main className="p-4 md:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}