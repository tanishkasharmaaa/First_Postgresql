import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import {
  validateRequest,
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
} from "../utils/validation";
import { UserController } from "../controllers/userController";

const userRouter = Router();

/**
 * Public routes
 */

// Register new user
userRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const validation = await validateRequest(userRegisterSchema, req.body);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ success: false, errors: validation.errors });
    }
    await UserController.register(req, res);
  }),
);

// Login user
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const validation = await validateRequest(userLoginSchema, req.body);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ success: false, errors: validation.errors });
    }
    await UserController.login(req, res);
  }),
);

/**
 * Protected routes
 */

// Get current user profile
userRouter.get(
  "/profile",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await UserController.getProfile(req, res);
  }),
);

// Update user profile
userRouter.put(
  "/profile",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const validation = await validateRequest(userUpdateSchema, req.body);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ success: false, errors: validation.errors });
    }
    await UserController.updateProfile(req, res);
  }),
);

// Change password
userRouter.post(
  "/change-password",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await UserController.changePassword(req, res);
  }),
);

/**
 * Admin routes
 */

// Get all users
userRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    await UserController.getAllUsers(req, res);
  }),
);

// Get user by ID
userRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    await UserController.getUserById(req, res);
  }),
);

// Blacklist user
userRouter.put(
  "/:id/blacklist",
  asyncHandler(async (req, res) => {
    await UserController.blacklistUser(req, res);
  }),
);

export default userRouter;
