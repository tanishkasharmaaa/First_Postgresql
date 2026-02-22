import { Router } from "express";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { validateRequest, productCreateSchema } from "../utils/validation";
import { ProductController } from "../controllers/productController";

const productRouter = Router();

/**
 * Product routes
 */

// Get all products
productRouter.get(
  "/",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await ProductController.getProducts(req, res);
  }),
);

// Get categories
productRouter.get(
  "/categories/list",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await ProductController.getCategories(req, res);
  }),
);

// Get brands
productRouter.get(
  "/brands/list",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await ProductController.getBrands(req, res);
  }),
);

// Get single product
productRouter.get(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await ProductController.getProduct(req, res);
  }),
);

// Create product (Admin only)
productRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const validation = await validateRequest(productCreateSchema, req.body);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ success: false, errors: validation.errors });
    }
    await ProductController.createProduct(req, res);
  }),
);

// Update product (Admin only)
productRouter.put(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await ProductController.updateProduct(req, res);
  }),
);

// Delete product (Admin only)
productRouter.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await ProductController.deleteProduct(req, res);
  }),
);

export default productRouter;
