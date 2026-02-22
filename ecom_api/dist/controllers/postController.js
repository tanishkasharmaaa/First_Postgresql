"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = exports.PostController = void 0;
const db_1 = require("../db");
const errorHandler_1 = require("../middleware/errorHandler");
const helpers_1 = require("../utils/helpers");
class PostController {
    /**
     * Get all posts
     */
    static async getPosts(req, res) {
        try {
            const { page = 1, limit = 10, user_id } = req.query;
            const { offset, limit: pageLimit } = (0, helpers_1.getPagination)(String(page), String(limit));
            let query = "SELECT p.*, u.name as author_name FROM posts p JOIN users u ON p.user_id = u.id WHERE 1=1";
            const params = [];
            let paramCount = 1;
            if (user_id) {
                query += ` AND p.user_id = $${paramCount}`;
                params.push(user_id);
                paramCount++;
            }
            query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
            const result = await db_1.pool.query(query, [...params, pageLimit, offset]);
            const countResult = await db_1.pool.query("SELECT COUNT(*) FROM posts");
            const total = parseInt(countResult.rows[0].count);
            return res.status(200).json({
                success: true,
                data: result.rows,
                pagination: (0, helpers_1.getPaginationMeta)(total, Number(page), Number(limit)),
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError(error.message || "Failed to fetch posts", 500);
        }
    }
    /**
     * Get single post with comments
     */
    static async getPost(req, res) {
        const { id } = req.params;
        try {
            const postResult = await db_1.pool.query("SELECT p.*, u.name as author_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = $1", [id]);
            if (postResult.rows.length === 0) {
                throw new errorHandler_1.AppError("Post not found", 404);
            }
            const commentsResult = await db_1.pool.query("SELECT c.*, u.name as author_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at DESC", [id]);
            return res.status(200).json({
                success: true,
                data: {
                    ...postResult.rows[0],
                    comments: commentsResult.rows,
                },
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to fetch post", 500);
        }
    }
    /**
     * Create post
     */
    static async createPost(req, res) {
        const { title, content, user_id } = req.body;
        try {
            const result = await db_1.pool.query(`INSERT INTO posts (title, content, user_id)
         VALUES ($1, $2, $3)
         RETURNING *`, [title, content, user_id]);
            return res.status(201).json({
                success: true,
                message: "Post created successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError(error.message || "Failed to create post", 500);
        }
    }
    /**
     * Update post
     */
    static async updatePost(req, res) {
        const { id } = req.params;
        const { title, content } = req.body;
        try {
            const result = await db_1.pool.query(`UPDATE posts SET 
          title = COALESCE($1, title),
          content = COALESCE($2, content),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`, [title, content, id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Post not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "Post updated successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to update post", 500);
        }
    }
    /**
     * Delete post
     */
    static async deletePost(req, res) {
        const { id } = req.params;
        try {
            const result = await db_1.pool.query("DELETE FROM posts WHERE id = $1 RETURNING id", [id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Post not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "Post deleted successfully",
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to delete post", 500);
        }
    }
}
exports.PostController = PostController;
class CommentController {
    /**
     * Add comment to post
     */
    static async addComment(req, res) {
        const { post_id } = req.params;
        const { content, user_id } = req.body;
        try {
            // Check if post exists
            const postCheck = await db_1.pool.query("SELECT id FROM posts WHERE id = $1", [
                post_id,
            ]);
            if (postCheck.rows.length === 0) {
                throw new errorHandler_1.AppError("Post not found", 404);
            }
            const result = await db_1.pool.query(`INSERT INTO comments (post_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`, [post_id, user_id, content]);
            return res.status(201).json({
                success: true,
                message: "Comment added successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to add comment", 500);
        }
    }
    /**
     * Delete comment
     */
    static async deleteComment(req, res) {
        const { id } = req.params;
        try {
            const result = await db_1.pool.query("DELETE FROM comments WHERE id = $1 RETURNING id", [id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Comment not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "Comment deleted successfully",
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to delete comment", 500);
        }
    }
}
exports.CommentController = CommentController;
