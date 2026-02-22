import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export class CartController {
  /**
   * Get user's cart
   */
  static async getCart(req: AuthRequest, res: Response) {
    const userId = req.user?.id;

    try {
      const result = await pool.query(
        `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.discount_price, p.image_url, p.stock_quantity,
                (COALESCE(p.discount_price, p.price) * c.quantity) as total_price
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = $1
         ORDER BY c.created_at DESC`,
        [userId],
      );

      let grandTotal = 0;
      result.rows.forEach((item: any) => {
        grandTotal += parseFloat(item.total_price);
      });

      return res.status(200).json({
        success: true,
        data: result.rows,
        summary: {
          total_items: result.rows.length,
          grand_total: parseFloat(grandTotal.toFixed(2)),
        },
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch cart", 500);
    }
  }

  /**
   * Add item to cart
   */
  static async addToCart(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { product_id, quantity } = req.body;

    try {
      // Check if product exists and is in stock
      const productCheck = await pool.query(
        "SELECT id, stock_quantity FROM products WHERE id = $1 AND is_active = true",
        [product_id],
      );

      if (productCheck.rows.length === 0) {
        throw new AppError("Product not found", 404);
      }

      if (productCheck.rows[0].stock_quantity < quantity) {
        throw new AppError("Insufficient stock", 400);
      }

      // Check if product already in cart
      const existingItem = await pool.query(
        "SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2",
        [userId, product_id],
      );

      let result;
      if (existingItem.rows.length > 0) {
        // Update quantity
        const newQuantity = existingItem.rows[0].quantity + quantity;

        if (newQuantity > productCheck.rows[0].stock_quantity) {
          throw new AppError("Insufficient stock", 400);
        }

        result = await pool.query(
          "UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *",
          [newQuantity, userId, product_id],
        );
      } else {
        // Insert new item
        result = await pool.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
          [userId, product_id, quantity],
        );
      }

      return res.status(201).json({
        success: true,
        message: "Item added to cart successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to add item to cart", 500);
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { product_id } = req.params;
    const { quantity } = req.body;

    try {
      if (quantity < 1) {
        throw new AppError("Quantity must be at least 1", 400);
      }

      // Check if product is in stock
      const productCheck = await pool.query(
        "SELECT stock_quantity FROM products WHERE id = $1",
        [product_id],
      );

      if (productCheck.rows.length === 0) {
        throw new AppError("Product not found", 404);
      }

      if (productCheck.rows[0].stock_quantity < quantity) {
        throw new AppError("Insufficient stock", 400);
      }

      const result = await pool.query(
        "UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *",
        [quantity, userId, product_id],
      );

      if (result.rows.length === 0) {
        throw new AppError("Cart item not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to update cart item", 500);
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { product_id } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *",
        [userId, product_id],
      );

      if (result.rows.length === 0) {
        throw new AppError("Cart item not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        error.message || "Failed to remove item from cart",
        500,
      );
    }
  }

  /**
   * Clear cart
   */
  static async clearCart(req: AuthRequest, res: Response) {
    const userId = req.user?.id;

    try {
      await pool.query("DELETE FROM cart WHERE user_id = $1", [userId]);

      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to clear cart", 500);
    }
  }
}
