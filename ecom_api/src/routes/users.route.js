"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const userController_1 = require("../controllers/userController");
const userRouter = (0, express_1.Router)();
/**
 * Public routes
 */
// Register new user
userRouter.post("/register", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const validation = await (0, validation_1.validateRequest)(validation_1.userRegisterSchema, req.body);
    if (!validation.valid) {
        return res
            .status(400)
            .json({ success: false, errors: validation.errors });
    }
    await userController_1.UserController.register(req, res);
}));
// Login user
userRouter.post("/login", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const validation = await (0, validation_1.validateRequest)(validation_1.userLoginSchema, req.body);
    if (!validation.valid) {
        return res
            .status(400)
            .json({ success: false, errors: validation.errors });
    }
    await userController_1.UserController.login(req, res);
}));
/**
 * Protected routes
 */
// Get current user profile
userRouter.get("/profile", auth_1.authMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await userController_1.UserController.getProfile(req, res);
}));
// Update user profile
userRouter.put("/profile", auth_1.authMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const validation = await (0, validation_1.validateRequest)(validation_1.userUpdateSchema, req.body);
    if (!validation.valid) {
        return res
            .status(400)
            .json({ success: false, errors: validation.errors });
    }
    await userController_1.UserController.updateProfile(req, res);
}));
// Change password
userRouter.post("/change-password", auth_1.authMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await userController_1.UserController.changePassword(req, res);
}));
/**
 * Admin routes
 */
// Get all users
userRouter.get("/", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await userController_1.UserController.getAllUsers(req, res);
}));
// Get user by ID
userRouter.get("/:id", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await userController_1.UserController.getUserById(req, res);
}));
// Blacklist user
userRouter.put("/:id/blacklist", (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await userController_1.UserController.blacklistUser(req, res);
}));
exports.default = userRouter;
