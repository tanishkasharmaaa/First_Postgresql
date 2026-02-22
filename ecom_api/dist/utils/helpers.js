"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverageRating = exports.isInStock = exports.sanitizeUser = exports.getPaginationMeta = exports.getPagination = exports.formatProductResponse = exports.applyDiscount = exports.calculateTotal = exports.generateOrderNumber = void 0;
/**
 * Generate a unique order number
 */
const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
exports.generateOrderNumber = generateOrderNumber;
/**
 * Calculate total with tax and shipping
 */
const calculateTotal = (subtotal, taxRate = 0.1, shippingAmount = 10) => {
    const tax = parseFloat((subtotal * taxRate).toFixed(2));
    const total = subtotal + tax + shippingAmount;
    return {
        subtotal,
        tax,
        shipping: shippingAmount,
        total: parseFloat(total.toFixed(2)),
    };
};
exports.calculateTotal = calculateTotal;
/**
 * Apply discount to price
 */
const applyDiscount = (price, discountPercent) => {
    return parseFloat((price - (price * discountPercent) / 100).toFixed(2));
};
exports.applyDiscount = applyDiscount;
/**
 * Format product response
 */
const formatProductResponse = (product) => {
    const discountedPrice = (0, exports.applyDiscount)(product.price, product.discount_percent || 0);
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
exports.formatProductResponse = formatProductResponse;
/**
 * Paginate results
 */
const getPagination = (page = 1, limit = 10) => {
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const offset = (pageNum - 1) * limitNum;
    return { page: pageNum, limit: limitNum, offset };
};
exports.getPagination = getPagination;
/**
 * Generate pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
    return {
        current_page: page,
        total_items: total,
        total_pages: Math.ceil(total / limit),
        items_per_page: limit,
        has_next: page * limit < total,
        has_prev: page > 1,
    };
};
exports.getPaginationMeta = getPaginationMeta;
/**
 * Sanitize user for response
 */
const sanitizeUser = (user) => {
    const { password, ...sanitized } = user;
    return sanitized;
};
exports.sanitizeUser = sanitizeUser;
/**
 * Check if product is in stock
 */
const isInStock = (quantity) => {
    return quantity > 0;
};
exports.isInStock = isInStock;
/**
 * Calculate average rating
 */
const calculateAverageRating = (reviews) => {
    if (reviews.length === 0)
        return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(2));
};
exports.calculateAverageRating = calculateAverageRating;
