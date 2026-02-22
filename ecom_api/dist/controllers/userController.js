"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
class UserController {
    /**
     * Register a new user
     */
    static async register(req, res) {
        const { name, email, password } = req.body;
        try {
            // Check if user already exists
            const existingUser = await db_1.pool.query("SELECT id FROM users WHERE email = $1", [email]);
            if (existingUser.rows.length > 0) {
                throw new errorHandler_1.AppError("Email already registered", 409);
            }
            // Hash password
            const passwordHash = await bcryptjs_1.default.hash(password, 12);
            // Create user
            const result = await db_1.pool.query(`INSERT INTO users (name, email, password) 
         VALUES ($1, $2, $3) 
         RETURNING id, name, email, created_at`, [name, email, passwordHash]);
            const user = result.rows[0];
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user,
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Registration failed", 500);
        }
    }
    /**
     * Login user
     */
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            // Find user
            const result = await db_1.pool.query("SELECT id, name, email, password, is_blacklisted FROM users WHERE email = $1", [email]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("Invalid email or password", 401);
            }
            const user = result.rows[0];
            // Check if user is blacklisted
            if (user.is_blacklisted) {
                throw new errorHandler_1.AppError("Your account has been suspended", 403);
            }
            // Compare password
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new errorHandler_1.AppError("Invalid email or password", 401);
            }
            // Generate JWT
            const secret = process.env.SECRET_PRIVATE_KEY;
            if (!secret) {
                throw new errorHandler_1.AppError("Secret key not configured", 500);
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secret, {
                expiresIn: "7d",
                algorithm: "HS256",
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                },
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Login failed", 500);
        }
    }
    /**
     * Get current user profile
     */
    static async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            const result = await db_1.pool.query(`SELECT id, name, email, phone, address, city, state, postal_code, 
                country, created_at, updated_at FROM users WHERE id = $1`, [userId]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            return res.status(200).json({
                success: true,
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to fetch profile", 500);
        }
    }
    /**
     * Update user profile
     */
    static async updateProfile(req, res) {
        const { name, phone, address, city, state, postal_code, country } = req.body;
        const userId = req.user?.id;
        try {
            const result = await db_1.pool.query(`UPDATE users SET 
          name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          address = COALESCE($3, address),
          city = COALESCE($4, city),
          state = COALESCE($5, state),
          postal_code = COALESCE($6, postal_code),
          country = COALESCE($7, country),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING id, name, email, phone, address, city, state, postal_code, country, updated_at`, [name, phone, address, city, state, postal_code, country, userId]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to update profile", 500);
        }
    }
    /**
     * Change password
     */
    static async changePassword(req, res) {
        const { current_password, new_password } = req.body;
        const userId = req.user?.id;
        try {
            // Verify current password
            const result = await db_1.pool.query("SELECT password FROM users WHERE id = $1", [userId]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            const isPasswordValid = await bcryptjs_1.default.compare(current_password, result.rows[0].password);
            if (!isPasswordValid) {
                throw new errorHandler_1.AppError("Current password is incorrect", 401);
            }
            // Hash new password
            const hashedPassword = await bcryptjs_1.default.hash(new_password, 12);
            // Update password
            await db_1.pool.query("UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [hashedPassword, userId]);
            return res.status(200).json({
                success: true,
                message: "Password changed successfully",
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to change password", 500);
        }
    }
    /**
     * Get all users (Admin only)
     */
    static async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const result = await db_1.pool.query(`SELECT id, name, email, phone, created_at FROM users 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`, [Number(limit), offset]);
            const countResult = await db_1.pool.query("SELECT COUNT(*) FROM users");
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
            throw new errorHandler_1.AppError(error.message || "Failed to fetch users", 500);
        }
    }
    /**
     * Get user by ID (Admin only)
     */
    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const result = await db_1.pool.query(`SELECT id, name, email, phone, address, city, state, postal_code, 
                country, is_blacklisted, created_at FROM users WHERE id = $1`, [id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            return res.status(200).json({
                success: true,
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to fetch user", 500);
        }
    }
    /**
     * Blacklist a user (Admin only)
     */
    static async blacklistUser(req, res) {
        const { id } = req.params;
        const { reason } = req.body;
        try {
            const result = await db_1.pool.query("UPDATE users SET is_blacklisted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, email", [id]);
            if (result.rows.length === 0) {
                throw new errorHandler_1.AppError("User not found", 404);
            }
            return res.status(200).json({
                success: true,
                message: "User blacklisted successfully",
                data: result.rows[0],
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(error.message || "Failed to blacklist user", 500);
        }
    }
}
exports.UserController = UserController;
