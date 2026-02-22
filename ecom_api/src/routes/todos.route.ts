import { Router } from "express";
import { optionalAuthMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { TodoController } from "../controllers/todoController";

const todoRouter = Router();

// Get all todos
todoRouter.get(
  "/",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await TodoController.getTodos(req, res);
  }),
);

// Get single todo
todoRouter.get(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await TodoController.getTodo(req, res);
  }),
);

// Create todo
todoRouter.post(
  "/",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await TodoController.createTodo(req, res);
  }),
);

// Update todo
todoRouter.put(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await TodoController.updateTodo(req, res);
  }),
);

// Delete todo
todoRouter.delete(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await TodoController.deleteTodo(req, res);
  }),
);

export default todoRouter;
