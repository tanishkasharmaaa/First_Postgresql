import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { getPagination, getPaginationMeta } from "../utils/helpers";

export class RecipeController {
  /**
   * Get all recipes
   */
  static async getRecipes(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 12, category, cuisine, search } = req.query;
      const { offset, limit: pageLimit } = getPagination(
        String(page),
        String(limit),
      );

      let query = "SELECT * FROM recipes WHERE 1=1";
      const params: any[] = [];
      let paramCount = 1;

      if (category) {
        query += ` AND category = $${paramCount}`;
        params.push(category);
        paramCount++;
      }

      if (cuisine) {
        query += ` AND cuisine = $${paramCount}`;
        params.push(cuisine);
        paramCount++;
      }

      if (search) {
        query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
        params.push(`%${search}%`);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      const result = await pool.query(query, [...params, pageLimit, offset]);

      const countResult = await pool.query("SELECT COUNT(*) FROM recipes");
      const total = parseInt(countResult.rows[0].count);

      return res.status(200).json({
        success: true,
        data: result.rows,
        pagination: getPaginationMeta(total, Number(page), Number(limit)),
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch recipes", 500);
    }
  }

  /**
   * Get single recipe
   */
  static async getRecipe(req: AuthRequest, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        throw new AppError("Recipe not found", 404);
      }

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to fetch recipe", 500);
    }
  }

  /**
   * Create recipe
   */
  static async createRecipe(req: AuthRequest, res: Response) {
    const {
      name,
      description,
      ingredients,
      instructions,
      category,
      cuisine,
      prep_time,
      cook_time,
      servings,
      image_url,
    } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO recipes (name, description, ingredients, instructions, category, cuisine, prep_time, cook_time, servings, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          name,
          description,
          ingredients,
          instructions,
          category,
          cuisine,
          prep_time,
          cook_time,
          servings,
          image_url,
        ],
      );

      return res.status(201).json({
        success: true,
        message: "Recipe created successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      throw new AppError(error.message || "Failed to create recipe", 500);
    }
  }

  /**
   * Update recipe
   */
  static async updateRecipe(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const {
      name,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE recipes SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          ingredients = COALESCE($3, ingredients),
          instructions = COALESCE($4, instructions),
          prep_time = COALESCE($5, prep_time),
          cook_time = COALESCE($6, cook_time),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [
          name,
          description,
          ingredients,
          instructions,
          prep_time,
          cook_time,
          id,
        ],
      );

      if (result.rows.length === 0) {
        throw new AppError("Recipe not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Recipe updated successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to update recipe", 500);
    }
  }

  /**
   * Delete recipe
   */
  static async deleteRecipe(req: AuthRequest, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM recipes WHERE id = $1 RETURNING id",
        [id],
      );

      if (result.rows.length === 0) {
        throw new AppError("Recipe not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Recipe deleted successfully",
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || "Failed to delete recipe", 500);
    }
  }
}
