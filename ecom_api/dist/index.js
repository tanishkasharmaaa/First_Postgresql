"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const todos_route_1 = __importDefault(require("./routes/todos.route"));
const recipes_route_1 = __importDefault(require("./routes/recipes.route"));
const posts_route_1 = __importDefault(require("./routes/posts.route"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Security Middleware
app.use((0, helmet_1.default)()); // Sets various HTTP headers
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many login attempts, please try again later",
});
app.use(limiter);
// Body parser middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Fake JSON API for Learning",
        version: "1.0.0",
        description: "Complete fake API with users, products, todos, recipes, and posts for learning projects",
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
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        timestamp: new Date(),
    });
});
// API Routes
app.use("/users", authLimiter, users_route_1.default);
app.use("/products", products_route_1.default);
app.use("/todos", todos_route_1.default);
app.use("/recipes", recipes_route_1.default);
app.use("/posts", posts_route_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
        method: req.method,
        availableEndpoints: {
            users: "GET /users, POST /users, GET /users/:id, PUT /users/:id",
            products: "GET /products, GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id",
            todos: "GET /todos, GET /todos/:id, POST /todos, PUT /todos/:id, DELETE /todos/:id",
            recipes: "GET /recipes, GET /recipes/:id, POST /recipes, PUT /recipes/:id, DELETE /recipes/:id",
            posts: "GET /posts, GET /posts/:id, POST /posts, PUT /posts/:id, DELETE /posts/:id, POST /posts/:post_id/comments",
        },
    });
});
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
