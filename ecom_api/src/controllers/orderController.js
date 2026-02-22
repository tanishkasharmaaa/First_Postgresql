"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const db_1 = require("../db");
const errorHandler_1 = require("../middleware/errorHandler");
const helpers_1 = require("../utils/helpers");
class OrderController {
    /**
     * Create order from cart
     */
    static async createOrder(req, res) {
        const userId = req.user?.id;
        const { shipping_address, payment_method } = req.body;
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            // Get user's cart
            const cartResult = await client.query(`SELECT c.product_id, c.quantity, p.price, p.discount_price, p.stock_quantity
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = $1`, [userId]);
            if (cartResult.rows.length === 0) {
                throw new errorHandler_1.AppError("Cart is empty", 400);
            }
            // Calculate subtotal and validate stock
            let subtotal = 0;
            for (const item of cartResult.rows) {
                if (item.stock_quantity < item.quantity) {
                    throw new errorHandler_1.AppError(`Insufficient stock for product ${item.product_id}`, 400);
                }
                const price = item.discount_price || item.price;
                subtotal += price * item.quantity;
            }
            // Calculate tax and shipping
            const { tax, shipping, total } = (0, helpers_1.calculateTotal)(subtotal);
            // Create order
            const orderNumber = (0, helpers_1.generateOrderNumber)();
            const orderResult = await client.query(`INSERT INTO orders (user_id, order_number, total_amount, discount_amount, tax_amount, shipping_amount, status, payment_method, shipping_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, order_number, total_amount, created_at`, [
                userId,
                orderNumber,
                total,
                0,
                tax,
                shipping,
                "pending",
                payment_method,
                shipping_address,
            ]);
            const orderId = orderResult.rows[0].id;
            // Create order items and update product stock
            for (const item of cartResult.rows) {
                const price = item.discount_price || item.price;
                const totalPrice = price * item.quantity;
                await client.query(`INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)`, [orderId, item.product_id, item.quantity, price, totalPrice]);
                // Decrease stock
                await client.query("UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2", [item.quantity, item.product_id]);
            }
            // Clear cart
            await client.query("DELETE FROM cart WHERE user_id = $1", [userId]);
            await client.query("COMMIT");
            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                data: {
                    order_id: orderId,
                    order_number: orderNumber,
                    total_amount: total,
                    tax: tax,
                    shipping: shipping,
                    status: "pending",
                },
            });
        }
        catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to create order", 500);
        }
        finally {
            client.release();
        }
    }
    /**
     * Get user's orders
     */
    static async getUserOrders(req, res) {
        const userId = req.user?.id;
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        try {
            const result = await db_1.pool.query(`SELECT id, order_number, total_amount, status, created_at, updated_at
         FROM orders
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`, [userId, Number(limit), offset]);
            const countResult = await db_1.pool.query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [userId]);
            const total = parseInt(countResult.rows[0].count);
            return res.status(200).json({
                success: true,
                data: result.rows,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError(error.message || "Failed to fetch orders", 500);
        }
    }
    /**
     * Get order details
     */
    static async getOrderDetails(req, res) {
        const { id } = req.params;
        const userId = req.user?.id;
        try {
            const orderResult = await db_1.pool.query(`SELECT id, order_number, total_amount, discount_amount, tax_amount, shipping_amount, 
                status, payment_method, shipping_address, tracking_number, 
                created_at, shipped_at, delivered_at
         FROM orders
         WHERE id = $1 AND user_id = $2`, [id, userId]);
            if (orderResult.rows.length === 0) {
                throw new errorHandler_1.AppError("Order not found", 404);
            }
            const itemsResult = await db_1.pool.query(`SELECT oi.id, oi.product_id, p.name, p.image_url, oi.quantity, oi.unit_price, oi.total_price
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`, [id]);
            return res.status(200).json({
                success: true,
                data: {
                    ...orderResult.rows[0],
                    items: itemsResult.rows,
                },
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to fetch order", 500);
        }
    }
    /**
     * Cancel order
     */
    static async cancelOrder(req, res) {
        const { id } = req.params;
        const userId = req.user?.id;
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            // Verify order belongs to user and can be cancelled
            const orderCheck = await client.query("SELECT id, status FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
            if (orderCheck.rows.length === 0) {
                throw new errorHandler_1.AppError("Order not found", 404);
            }
            if (orderCheck.rows[0].status !== "pending") {
                throw new errorHandler_1.AppError("Can only cancel pending orders", 400);
            }
            // Get order items
            const itemsResult = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [id]);
            // Restore stock
            for (const item of itemsResult.rows) {
                await client.query("UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2", [item.quantity, item.product_id]);
            }
            // Update order status
            const result = await client.query("UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", ["cancelled", id]);
            await client.query("COMMIT");
            return res.status(200).json({
                success: true,
                message: "Order cancelled successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            await client.query("ROLLBACK");
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to cancel order", 500);
        }
        finally {
            client.release();
        }
    }
    /**
     * Update order status (Admin only)
     */
    static async updateOrderStatus(req, res) {
        const { id } = req.params;
        const { status, tracking_number } = req.body;
        try {
            const validStatuses = [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ];
            if (!validStatuses.includes(status)) {
                throw new errorHandler_1.AppError("Invalid order status", 400);
            }
            const shippedAt = status === "shipped" ? new Date() : null;
            const deliveredAt = status === "delivered" ? new Date() : null;
            const result = await db_1.pool.query(`UPDATE orders SET status = $1, tracking_number = $2, shipped_at = COALESCE($3, shipped_at), 
                delivered_at = COALESCE($4, delivered_at), updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`, [status, tracking_number, shippedAt, deliveredAt, id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Order not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "Order status updated successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to update order", 500);
        }
    }
    /**
     * Get all orders (Admin only)
     */
    static async getAllOrders(req, res) {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        try {
            let query = "SELECT id, order_number, user_id, total_amount, status, created_at FROM orders";
            const params = [];
            if (status) {
                query += " WHERE status = $1";
                params.push(status);
            }
            query +=
                " ORDER BY created_at DESC LIMIT $" +
                    (params.length + 1) +
                    " OFFSET $" +
                    (params.length + 2);
            params.push(Number(limit), offset);
            const result = await db_1.pool.query(query, params);
            let countQuery = "SELECT COUNT(*) FROM orders";
            if (status) {
                countQuery += " WHERE status = $1";
            }
            const countResult = await db_1.pool.query(countQuery, status ? [status] : []);
            const total = parseInt(countResult.rows[0].count);
            return res.status(200).json({
                success: true,
                data: result.rows,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError(error.message || "Failed to fetch orders", 500);
        }
    }
}
exports.OrderController = OrderController;
