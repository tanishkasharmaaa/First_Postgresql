export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id: number;
  image_url?: string;
  stock_quantity: number;
  sku?: string;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type Category = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type ProductReview = {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at?: Date;
  updated_at?: Date;
};

export type Cart = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
};

export type Order = {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment_method: string;
  shipping_address: string;
  tracking_number?: string;
  created_at?: Date;
  shipped_at?: Date;
  delivered_at?: Date;
  updated_at?: Date;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: Date;
};
