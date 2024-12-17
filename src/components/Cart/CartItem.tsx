// components/Cart/CartItem.tsx
import Image from 'next/image';
import { Trash2, Minus, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CartItemProps {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    photo: string;
    stock: number;
    is_discount?: boolean;
    discount_price?: number;
    discount_percentage?: number;
    onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
    onRemove: (id: number) => Promise<void>;
  }
  
  export const CartItem = ({
    id,
    product_id,
    name,
    price,
    quantity,
    photo,
    stock,
    is_discount,
    discount_price,
    discount_percentage,
    onUpdateQuantity,
    onRemove
  }: CartItemProps) => {
  const finalPrice = is_discount ? discount_price || price : price;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    try {
      setIsUpdating(true);
      await onUpdateQuantity(product_id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await onRemove(product_id);
    } finally {
      setIsRemoving(false);
    }
  };
  
  return (
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${photo}`}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
          {name}
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleUpdateQuantity(Math.max(1, quantity - 1))}
              disabled={isUpdating || quantity <= 1}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-sm sm:text-base min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(Math.min(stock, quantity + 1))}
              disabled={isUpdating || quantity >= stock}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {is_discount ? (
              <>
                <span className="text-sm sm:text-base text-gray-500 line-through">
                  Rp {price.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  Rp {discount_price?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-medium text-gray-900">
                Rp {price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="text-sm text-red-600 hover:text-red-800 transition-colors sm:ml-4"
      >
        {isRemoving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};