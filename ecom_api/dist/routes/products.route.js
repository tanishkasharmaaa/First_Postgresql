"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const productController_1 = require("../controllers/productController");
const productRouter = (0, express_1.Router)();
/**
 * Product routes
 */
// Get all products
productRouter.get("/", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await productController_1.ProductController.getProducts(req, res);
}));
// Get categories
productRouter.get("/categories/list", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await productController_1.ProductController.getCategories(req, res);
}));
// Get brands
productRouter.get("/brands/list", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await productController_1.ProductController.getBrands(req, res);
}));
// Get single product
productRouter.get("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await productController_1.ProductController.getProduct(req, res);
}));
// Create product (Admin only)
productRouter.post("/", auth_1.authMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const validation = await (0, validation_1.validateRequest)(validation_1.productCreateSchema, req.body);
    if (!validation.valid) {
        return res
            .status(400)
            .json({ success: false, errors: validation.errors });
    }
    await productController_1.ProductController.createProduct(req, res);
}));
// Update product (Admin only)
productRouter.put("/:id", auth_1.authMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await productController_1.ProductController.updateProduct(req, res);
}));
// Delete product (Admin only)
productRouter.delete("/:id", auth_1.authMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await productController_1.ProductController.deleteProduct(req, res);
}));
exports.default = productRouter;
