// app/profile/address/page.tsx
import AddressForm from '@/components/forms/AddressForm';

export default function AddressPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Delivery Address
        </h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <AddressForm />
        </div>
      </div>
    </div>
  );
}