"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const db_1 = require("../db");
const errorHandler_1 = require("../middleware/errorHandler");
const helpers_1 = require("../utils/helpers");
class TodoController {
    /**
     * Get all todos
     */
    static async getTodos(req, res) {
        try {
            const { page = 1, limit = 10, status, user_id } = req.query;
            const { offset, limit: pageLimit } = (0, helpers_1.getPagination)(String(page), String(limit));
            let query = "SELECT * FROM todos WHERE 1=1";
            const params = [];
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
            const result = await db_1.pool.query(query, [...params, pageLimit, offset]);
            const countResult = await db_1.pool.query("SELECT COUNT(*) FROM todos");
            const total = parseInt(countResult.rows[0].count);
            return res.status(200).json({
                success: true,
                data: result.rows,
                pagination: (0, helpers_1.getPaginationMeta)(total, Number(page), Number(limit)),
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError(error.message || "Failed to fetch todos", 500);
        }
    }
    /**
     * Get single todo
     */
    static async getTodo(req, res) {
        const { id } = req.params;
        try {
            const result = await db_1.pool.query("SELECT * FROM todos WHERE id = $1", [
                id,
            ]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Todo not found", 404);
            }
            return res.status(200).json({ success: true, data: result.rows[0] });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to fetch todo", 500);
        }
    }
    /**
     * Create todo
     */
    static async createTodo(req, res) {
        const { title, description, status, user_id } = req.body;
        try {
            const result = await db_1.pool.query(`INSERT INTO todos (title, description, status, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`, [title, description || null, status || "pending", user_id]);
            return res.status(201).json({
                success: true,
                message: "Todo created successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError(error.message || "Failed to create todo", 500);
        }
    }
    /**
     * Update todo
     */
    static async updateTodo(req, res) {
        const { id } = req.params;
        const { title, description, status } = req.body;
        try {
            const result = await db_1.pool.query(`UPDATE todos SET 
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`, [title, description, status, id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Todo not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "Todo updated successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to update todo", 500);
        }
    }
    /**
     * Delete todo
     */
    static async deleteTodo(req, res) {
        const { id } = req.params;
        try {
            const result = await db_1.pool.query("DELETE FROM todos WHERE id = $1 RETURNING id", [id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Todo not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "Todo deleted successfully",
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to delete todo", 500);
        }
    }
}
exports.TodoController = TodoController;
