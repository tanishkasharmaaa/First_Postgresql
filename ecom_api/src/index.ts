import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/users.route";
import productRouter from "./routes/products.route";
import todoRouter from "./routes/todos.route";
import recipeRouter from "./routes/recipes.route";
import postRouter from "./routes/posts.route";
import { errorHandler, AppError } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet()); // Sets various HTTP headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later",
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Fake JSON API for Learning",
    version: "1.0.0",
    description:
      "Complete fake API with users, products, todos, recipes, and posts for learning projects",
    endpoints: {
      users: "/users",
      products: "/products",
      todos: "/todos",
      recipes: "/recipes",
      posts: "/posts",
    },
    features: [
      "User Authentication",
      "Product Listings (50+ products)",
      "Todo Management",
      "Recipe Database (40+ recipes)",
      "Blog Posts with Comments",
      "Pagination & Filtering",
      "RESTful API Design",
      "Error Handling",
    ],
  });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/users", authLimiter, userRouter);
app.use("/products", productRouter);
app.use("/todos", todoRouter);
app.use("/recipes", recipeRouter);
app.use("/posts", postRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
    availableEndpoints: {
      users: "GET /users, POST /users, GET /users/:id, PUT /users/:id",
      products:
        "GET /products, GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id",
      todos:
        "GET /todos, GET /todos/:id, POST /todos, PUT /todos/:id, DELETE /todos/:id",
      recipes:
        "GET /recipes, GET /recipes/:id, POST /recipes, PUT /recipes/:id, DELETE /recipes/:id",
      posts:
        "GET /posts, GET /posts/:id, POST /posts, PUT /posts/:id, DELETE /posts/:id, POST /posts/:post_id/comments",
    },
  });
});

// Error handler (must be last)
app.use(errorHandler as any);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
