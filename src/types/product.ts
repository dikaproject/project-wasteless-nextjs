export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  quantity: number;
  massa: string;
  expired: string;
  is_active: boolean;
  photo?: string;
  category_name?: string;
  created_at: string;
  price?: number;
  price_id: number;
  is_discount: boolean;
  discount_percentage: number;
  discount_price: number;
  start_date: string | null;
  end_date: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}
