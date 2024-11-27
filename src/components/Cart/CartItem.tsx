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
    <div className="flex items-center gap-6 p-6 hover:bg-gray-50 transition-colors border-b last:border-b-0">
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${photo}`}
          alt={name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{name}</h3>
        
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-medium text-gray-900">
            Rp {finalPrice.toLocaleString()}
          </span>
          {is_discount && (
            <>
              <span className="text-sm text-gray-500 line-through">
                Rp {price.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                -{discount_percentage}%
              </span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center bg-white rounded-lg shadow-sm border">
            <button
              onClick={() => handleUpdateQuantity(Math.max(1, quantity - 1))}
              disabled={isUpdating || quantity <= 1}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="relative px-2 py-1 min-w-[3rem] text-center">
              <input
                type="number"
                min="1"
                max={stock}
                value={quantity}
                onChange={(e) => handleUpdateQuantity(Math.min(stock, Math.max(1, parseInt(e.target.value) || 1)))}
                disabled={isUpdating}
                className="w-full text-center focus:outline-none disabled:bg-transparent appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                </div>
              )}
            </div>
            
            <button
              onClick={() => handleUpdateQuantity(Math.min(stock, quantity + 1))}
              disabled={isUpdating || quantity >= stock}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {stock < 10 && (
            <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Only {stock} left
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span className="font-medium text-gray-900 text-lg">
          Rp {(finalPrice * quantity).toLocaleString()}
        </span>
        
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRemoving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};