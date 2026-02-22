import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { getPagination, getPaginationMeta } from "../utils/helpers";

export class ProductController {
  /**
   * Create a new product (Admin only)
   */
  static async createProduct(req: AuthRequest, res: Response) {
    const {
      title,
      description,
      price,
      discount_percent,
      stock,
      image_url,
      category,
      brand,
    } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO products (title, description, price, discount_percent, stock, image_url, category, brand)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          title,
          description,
          price,
          discount_percent || 0,
          stock,
          image_url,
          category,
          brand,
        ],
      );

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to create product", 500);
    }
  }

  /**
   * Get all products with filters and pagination
   */
  static async getProducts(req: AuthRequest, res: Response) {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      search,
      sort = "newest",
    } = req.query;
    const { offset, limit: pageLimit } = getPagination(
      String(page),
      String(limit),
    );

    try {
      let query = "SELECT * FROM products WHERE 1=1";
      const params: any[] = [];
      let paramCount = 1;

      // Add category filter
      if (category) {
        query += ` AND category ILIKE $${paramCount}`;
        params.push(`%${category}%`);
        paramCount++;
      }

      // Add brand filter
      if (brand) {
        query += ` AND brand ILIKE $${paramCount}`;
        params.push(`%${brand}%`);
        paramCount++;
      }

      // Add search filter
      if (search) {
        query += ` AND (LOWER(title) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
        params.push(`%${search}%`);
        paramCount++;
      }

      // Add sorting
      switch (sort) {
        case "price_low":
          query += " ORDER BY price ASC";
          break;
        case "price_high":
          query += " ORDER BY price DESC";
          break;
        case "rating":
          query += " ORDER BY rating DESC";
          break;
        case "newest":
        default:
          query += " ORDER BY created_at DESC";
          break;
      }

      // Get total count
      let countQuery = "SELECT COUNT(*) FROM products WHERE 1=1";
      const countParams: any[] = [];
      let countParamCount = 1;

      if (category) {
        countQuery += ` AND category ILIKE $${countParamCount}`;
        countParams.push(`%${category}%`);
        countParamCount++;
      }

      if (brand) {
        countQuery += ` AND brand ILIKE $${countParamCount}`;
        countParams.push(`%${brand}%`);
        countParamCount++;
      }

      if (search) {
        countQuery += ` AND (LOWER(title) LIKE LOWER($${countParamCount}) OR LOWER(description) LIKE LOWER($${countParamCount}))`;
        countParams.push(`%${search}%`);
        countParamCount++;
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      // Get paginated results
      const result = await pool.query(
        query + ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
        [...params, pageLimit, offset],
      );

      return res.status(200).json({
        success: true,
        data: result.rows,
        pagination: getPaginationMeta(total, Number(page), Number(limit)),
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch products", 500);
    }
  }

  /**
   * Get single product by ID
   */
  static async getProduct(req: AuthRequest, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query("SELECT * FROM products WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        throw new AppError("Product not found", 404);
      }

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to fetch product", 500);
    }
  }

  /**
   * Update product (Admin only)
   */
  static async updateProduct(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      discount_percent,
      stock,
      image_url,
      category,
      brand,
      rating,
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE products SET 
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          discount_percent = COALESCE($4, discount_percent),
          stock = COALESCE($5, stock),
          image_url = COALESCE($6, image_url),
          category = COALESCE($7, category),
          brand = COALESCE($8, brand),
          rating = COALESCE($9, rating),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [
          title,
          description,
          price,
          discount_percent,
          stock,
          image_url,
          category,
          brand,
          rating,
          id,
        ],
      );

      if (result.rows.length === 0) {
        throw new AppError("Product not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to update product", 500);
    }
  }

  /**
   * Delete product (Admin only)
   */
  static async deleteProduct(req: AuthRequest, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM products WHERE id = $1 RETURNING id",
        [id],
      );

      if (result.rows.length === 0) {
        throw new AppError("Product not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to delete product", 500);
    }
  }

  /**
   * Get unique categories
   */
  static async getCategories(req: AuthRequest, res: Response) {
    try {
      const result = await pool.query(
        "SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category ASC",
      );

      return res.status(200).json({
        success: true,
        data: result.rows.map((row) => row.category),
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch categories", 500);
    }
  }

  /**
   * Get unique brands
   */
  static async getBrands(req: AuthRequest, res: Response) {
    try {
      const result = await pool.query(
        "SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL ORDER BY brand ASC",
      );

      return res.status(200).json({
        success: true,
        data: result.rows.map((row) => row.brand),
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch brands", 500);
    }
  }
}
