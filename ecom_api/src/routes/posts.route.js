"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const postController_1 = require("../controllers/postController");
const postRouter = (0, express_1.Router)();
// Get all posts
postRouter.get("/", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await postController_1.PostController.getPosts(req, res);
}));
// Get single post with comments
postRouter.get("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await postController_1.PostController.getPost(req, res);
}));
// Create post
postRouter.post("/", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await postController_1.PostController.createPost(req, res);
}));
// Update post
postRouter.put("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await postController_1.PostController.updatePost(req, res);
}));
// Delete post
postRouter.delete("/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await postController_1.PostController.deletePost(req, res);
}));
// Add comment to post
postRouter.post("/:post_id/comments", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await postController_1.CommentController.addComment(req, res);
}));
// Delete comment
postRouter.delete("/comments/:id", auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await postController_1.CommentController.deleteComment(req, res);
}));
exports.default = postRouter;
