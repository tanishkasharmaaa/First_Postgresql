"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.productCreateSchema = exports.userUpdateSchema = exports.userLoginSchema = exports.userRegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// User validation schemas
exports.userRegisterSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(255).required().messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 255 characters",
        "any.required": "Name is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default
        .string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .required()
        .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base": "Password must contain uppercase, lowercase, number and special character",
        "any.required": "Password is required",
    }),
    confirm_password: joi_1.default
        .string()
        .valid(joi_1.default.ref("password"))
        .required()
        .messages({
        "any.only": "Passwords do not match",
        "any.required": "Please confirm your password",
    }),
});
exports.userLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().required().messages({
        "any.required": "Password is required",
    }),
});
exports.userUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(255).optional(),
    phone: joi_1.default
        .string()
        .pattern(/^\+?[\d\s-]{10,}$/)
        .optional(),
    address: joi_1.default.string().max(500).optional(),
    city: joi_1.default.string().max(100).optional(),
    state: joi_1.default.string().max(100).optional(),
    postal_code: joi_1.default.string().max(20).optional(),
    country: joi_1.default.string().max(100).optional(),
});
// Product validation schemas
exports.productCreateSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(255).required().messages({
        "string.min": "Product title must be at least 3 characters",
        "string.max": "Product title cannot exceed 255 characters",
        "any.required": "Product title is required",
    }),
    description: joi_1.default.string().min(10).max(2000).required().messages({
        "string.min": "Description must be at least 10 characters",
        "string.max": "Description cannot exceed 2000 characters",
        "any.required": "Description is required",
    }),
    price: joi_1.default.number().positive().required().messages({
        "number.positive": "Price must be greater than 0",
        "any.required": "Price is required",
    }),
    discount_percent: joi_1.default.number().min(0).max(100).optional().messages({
        "number.min": "Discount cannot be less than 0%",
        "number.max": "Discount cannot exceed 100%",
    }),
    stock: joi_1.default.number().integer().min(0).required().messages({
        "number.min": "Stock must be 0 or greater",
        "any.required": "Stock quantity is required",
    }),
    image_url: joi_1.default.string().uri().optional().messages({
        "string.uri": "Image URL must be a valid URI",
    }),
    category: joi_1.default.string().max(255).optional(),
    brand: joi_1.default.string().max(255).optional(),
});
const validateRequest = async (schema, data) => {
    try {
        const validated = await schema.validateAsync(data, { abortEarly: false });
        return { valid: true, data: validated, errors: null };
    }
    catch (error) {
        const errors = error.details?.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
        })) || [];
        return { valid: false, data: null, errors };
    }
};
exports.validateRequest = validateRequest;
