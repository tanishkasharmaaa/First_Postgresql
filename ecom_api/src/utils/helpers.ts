import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique order number
 */
export const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Calculate total with tax and shipping
 */
export const calculateTotal = (
  subtotal: number,
  taxRate: number = 0.1,
  shippingAmount: number = 10,
): { subtotal: number; tax: number; shipping: number; total: number } => {
  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const total = subtotal + tax + shippingAmount;
  return {
    subtotal,
    tax,
    shipping: shippingAmount,
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Apply discount to price
 */
export const applyDiscount = (
  price: number,
  discountPercent: number,
): number => {
  return parseFloat((price - (price * discountPercent) / 100).toFixed(2));
};

/**
 * Format product response
 */
export const formatProductResponse = (product: any) => {
  const discountedPrice = applyDiscount(
    product.price,
    product.discount_percent || 0,
  );

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discounted_price: discountedPrice,
    discount_percent: product.discount_percent || 0,
    category: product.category,
    brand: product.brand,
    image_url: product.image_url,
    stock: product.stock,
    in_stock: product.stock > 0,
    rating: product.rating ? parseFloat(product.rating) : 0,
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
};

/**
 * Paginate results
 */
export const getPagination = (
  page: string | number = 1,
  limit: string | number = 10,
) => {
  const pageNum = Math.max(1, parseInt(String(page)));
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
  const offset = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, offset };
};

/**
 * Generate pagination metadata
 */
export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => {
  return {
    current_page: page,
    total_items: total,
    total_pages: Math.ceil(total / limit),
    items_per_page: limit,
    has_next: page * limit < total,
    has_prev: page > 1,
  };
};

/**
 * Sanitize user for response
 */
export const sanitizeUser = (user: any) => {
  const { password, ...sanitized } = user;
  return sanitized;
};

/**
 * Check if product is in stock
 */
export const isInStock = (quantity: number): boolean => {
  return quantity > 0;
};

/**
 * Calculate average rating
 */
export const calculateAverageRating = (reviews: any[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(2));
};
