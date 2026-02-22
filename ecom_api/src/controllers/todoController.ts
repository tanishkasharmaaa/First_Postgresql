import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { getPagination, getPaginationMeta } from "../utils/helpers";

export class TodoController {
  /**
   * Get all todos
   */
  static async getTodos(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, status, user_id } = req.query;
      const { offset, limit: pageLimit } = getPagination(
        String(page),
        String(limit),
      );

      let query = "SELECT * FROM todos WHERE 1=1";
      const params: any[] = [];
      let paramCount = 1;

      if (status) {
        query += ` AND status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      if (user_id) {
        query += ` AND user_id = $${paramCount}`;
        params.push(user_id);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      const result = await pool.query(query, [...params, pageLimit, offset]);

      const countResult = await pool.query("SELECT COUNT(*) FROM todos");
      const total = parseInt(countResult.rows[0].count);

      return res.status(200).json({
        success: true,
        data: result.rows,
        pagination: getPaginationMeta(total, Number(page), Number(limit)),
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch todos", 500);
    }
  }

  /**
   * Get single todo
   */
  static async getTodo(req: AuthRequest, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        throw new AppError("Todo not found", 404);
      }

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to fetch todo", 500);
    }
  }

  /**
   * Create todo
   */
  static async createTodo(req: AuthRequest, res: Response) {
    const { title, description, status, user_id } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO todos (title, description, status, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, description || null, status || "pending", user_id],
      );

      return res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to create todo", 500);
    }
  }

  /**
   * Update todo
   */
  static async updateTodo(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
      const result = await pool.query(
        `UPDATE todos SET 
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [title, description, status, id],
      );

      if (result.rows.length === 0) {
        throw new AppError("Todo not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to update todo", 500);
    }
  }

  /**
   * Delete todo
   */
  static async deleteTodo(req: AuthRequest, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM todos WHERE id = $1 RETURNING id",
        [id],
      );

      if (result.rows.length === 0) {
        throw new AppError("Todo not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to delete todo", 500);
    }
  }
}
