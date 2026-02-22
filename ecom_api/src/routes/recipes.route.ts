import { Router } from "express";
import { optionalAuthMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { RecipeController } from "../controllers/recipeController";

const recipeRouter = Router();

// Get all recipes
recipeRouter.get(
  "/",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await RecipeController.getRecipes(req, res);
  }),
);

// Get single recipe
recipeRouter.get(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await RecipeController.getRecipe(req, res);
  }),
);

// Create recipe
recipeRouter.post(
  "/",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await RecipeController.createRecipe(req, res);
  }),
);

// Update recipe
recipeRouter.put(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await RecipeController.updateRecipe(req, res);
  }),
);

// Delete recipe
recipeRouter.delete(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await RecipeController.deleteRecipe(req, res);
  }),
);

export default recipeRouter;
