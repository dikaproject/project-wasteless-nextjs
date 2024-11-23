// types/product.ts
export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  quantity: number;
  massa: string;
  expired: string;
  is_active: boolean;
  category_name?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}