import { Router } from "express";
import { optionalAuthMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import {
  PostController,
  CommentController,
} from "../controllers/postController";

const postRouter = Router();

// Get all posts
postRouter.get(
  "/",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await PostController.getPosts(req, res);
  }),
);

// Get single post with comments
postRouter.get(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await PostController.getPost(req, res);
  }),
);

// Create post
postRouter.post(
  "/",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await PostController.createPost(req, res);
  }),
);

// Update post
postRouter.put(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await PostController.updatePost(req, res);
  }),
);

// Delete post
postRouter.delete(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await PostController.deletePost(req, res);
  }),
);

// Add comment to post
postRouter.post(
  "/:post_id/comments",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await CommentController.addComment(req, res);
  }),
);

// Delete comment
postRouter.delete(
  "/comments/:id",
  optionalAuthMiddleware,
  asyncHandler(async (req, res) => {
    await CommentController.deleteComment(req, res);
  }),
);

export default postRouter;
