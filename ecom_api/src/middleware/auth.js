"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authorization token provided",
            });
        }
        const secret = process.env.SECRET_PRIVATE_KEY;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "Secret key is not configured",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const secret = process.env.SECRET_PRIVATE_KEY;
            if (secret) {
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                req.user = decoded;
            }
        }
        next();
    }
    catch (error) {
        // Silently fail - user will be treated as unauthenticated
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
