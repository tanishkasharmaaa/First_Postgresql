"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const todoController_1 = require("../controllers/todoController");
const todoRouter = (0, express_1.Router)();
// Get all todos
todoRouter.get("/", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await todoController_1.TodoController.getTodos(req, res);
}));
// Get single todo
todoRouter.get("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await todoController_1.TodoController.getTodo(req, res);
}));
// Create todo
todoRouter.post("/", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await todoController_1.TodoController.createTodo(req, res);
}));
// Update todo
todoRouter.put("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await todoController_1.TodoController.updateTodo(req, res);
}));
// Delete todo
todoRouter.delete("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await todoController_1.TodoController.deleteTodo(req, res);
}));
exports.default = todoRouter;
