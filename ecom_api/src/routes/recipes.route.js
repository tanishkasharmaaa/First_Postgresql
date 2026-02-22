"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const recipeController_1 = require("../controllers/recipeController");
const recipeRouter = (0, express_1.Router)();
// Get all recipes
recipeRouter.get("/", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await recipeController_1.RecipeController.getRecipes(req, res);
}));
// Get single recipe
recipeRouter.get("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await recipeController_1.RecipeController.getRecipe(req, res);
}));
// Create recipe
recipeRouter.post("/", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await recipeController_1.RecipeController.createRecipe(req, res);
}));
// Update recipe
recipeRouter.put("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await recipeController_1.RecipeController.updateRecipe(req, res);
}));
// Delete recipe
recipeRouter.delete("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await recipeController_1.RecipeController.deleteRecipe(req, res);
}));
exports.default = recipeRouter;
