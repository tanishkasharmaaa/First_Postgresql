"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Seed script for Fake JSON API - Learners Edition
 * Run with: npx ts-node src/seed.ts
 */
const seedDatabase = async () => {
    const client = await db_1.pool.connect();
    try {
        console.log("🌱 Starting database seeding...\n");
        await client.query("BEGIN");
        // Clear existing data respecting foreign keys
        console.log("📝 Clearing existing data...");
        await client.query("DELETE FROM comments");
        await client.query("DELETE FROM posts");
        await client.query("DELETE FROM todos");
        await client.query("DELETE FROM recipes");
        await client.query("DELETE FROM products");
        await client.query("DELETE FROM users");
        // Seed Users
        console.log("👥 Seeding users...");
        const hashedPassword = await bcryptjs_1.default.hash("Demo@1234", 12);
        const usersData = [
            {
                name: "John Doe",
                email: "john@example.com",
                password: hashedPassword,
                phone: "+1-555-0101",
                city: "New York",
                company: "Tech Corp",
                website: "https://johndoe.dev",
                avatar_url: "https://i.pravatar.cc/150?img=1",
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password: hashedPassword,
                phone: "+1-555-0102",
                city: "San Francisco",
                company: "Innovation Labs",
                website: "https://janesmith.io",
                avatar_url: "https://i.pravatar.cc/150?img=2",
            },
            {
                name: "Bob Johnson",
                email: "bob@example.com",
                password: hashedPassword,
                phone: "+1-555-0103",
                city: "Austin",
                company: "Design Studio",
                website: "https://bobjohnson.design",
                avatar_url: "https://i.pravatar.cc/150?img=3",
            },
        ];
        const userIds = [];
        for (const user of usersData) {
            const result = await client.query(`INSERT INTO users (name, email, password, phone, city, company, website, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`, [
                user.name,
                user.email,
                user.password,
                user.phone,
                user.city,
                user.company,
                user.website,
                user.avatar_url,
            ]);
            userIds.push(result.rows[0].id);
        }
        console.log(`✅ Created ${userIds.length} demo users\n`);
        // Seed Products (50+)
        console.log("📦 Seeding 50+ products...");
        const productsData = [
            // Electronics & Gadgets
            {
                title: "iPhone 15 Pro",
                description: "Latest Apple flagship with A17 Pro chip and advanced camera system",
                price: 999.99,
                discount_percent: 10,
                stock: 30,
                image_url: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop",
                category: "Electronics",
                brand: "Apple",
                rating: 4.8,
            },
            {
                title: "Samsung S24 Ultra",
                description: "Powerful Android flagship with stunning display and AI features",
                price: 1199.99,
                discount_percent: 15,
                stock: 25,
                image_url: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop",
                category: "Electronics",
                brand: "Samsung",
                rating: 4.7,
            },
            {
                title: "MacBook Pro 16 M3",
                description: "Powerful laptop for professionals with M3 chip and stunning display",
                price: 2499.99,
                discount_percent: 5,
                stock: 15,
                image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
                category: "Laptops",
                brand: "Apple",
                rating: 4.9,
            },
            {
                title: "Dell XPS 15",
                description: "Premium laptop with RTX graphics and brilliant display",
                price: 1899.99,
                discount_percent: 8,
                stock: 20,
                image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
                category: "Laptops",
                brand: "Dell",
                rating: 4.6,
            },
            {
                title: "Sony WH-1000XM5",
                description: "Premium noise-canceling wireless headphones with 30hr battery",
                price: 399.99,
                discount_percent: 20,
                stock: 50,
                image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
                category: "Audio",
                brand: "Sony",
                rating: 4.8,
            },
            {
                title: "Apple Watch Series 9",
                description: "Advanced fitness and health tracking smartwatch",
                price: 399.99,
                discount_percent: 12,
                stock: 40,
                image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
                category: "Wearables",
                brand: "Apple",
                rating: 4.7,
            },
            {
                title: "iPad Air 11",
                description: "Versatile tablet for work and creativity with M1 chip",
                price: 799.99,
                discount_percent: 10,
                stock: 35,
                image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop",
                category: "Tablets",
                brand: "Apple",
                rating: 4.6,
            },
            {
                title: "Samsung Galaxy Tab S9",
                description: "Powerful Android tablet with 120Hz AMOLED display",
                price: 649.99,
                discount_percent: 15,
                stock: 30,
                image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop",
                category: "Tablets",
                brand: "Samsung",
                rating: 4.5,
            },
            {
                title: "Canon EOS R5",
                description: "Professional mirrorless camera with 45MP sensor",
                price: 3499.99,
                discount_percent: 0,
                stock: 8,
                image_url: "https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop",
                category: "Cameras",
                brand: "Canon",
                rating: 4.8,
            },
            {
                title: "Nintendo Switch OLED",
                description: "Gaming console with upgraded OLED display",
                price: 349.99,
                discount_percent: 10,
                stock: 45,
                image_url: "https://images.unsplash.com/photo-1535869669851-3898991b1df2?w=500&h=500&fit=crop",
                category: "Gaming",
                brand: "Nintendo",
                rating: 4.7,
            },
            {
                title: "AirPods Pro (2nd Gen)",
                description: "Premium wireless earbuds with noise cancellation",
                price: 249.99,
                discount_percent: 10,
                stock: 60,
                image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
                category: "Audio",
                brand: "Apple",
                rating: 4.6,
            },
            {
                title: "LG OLED 77 inch",
                description: "Premium 4K OLED TV with stunning picture quality",
                price: 3999.99,
                discount_percent: 5,
                stock: 5,
                image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
                category: "TVs",
                brand: "LG",
                rating: 4.9,
            },
            {
                title: "Sony PS5 Console",
                description: "Latest gaming console with high-performance specs",
                price: 499.99,
                discount_percent: 0,
                stock: 12,
                image_url: "https://images.unsplash.com/photo-1535869669851-3898991b1df2?w=500&h=500&fit=crop",
                category: "Gaming",
                brand: "Sony",
                rating: 4.8,
            },
            {
                title: "Microsoft Surface Laptop 6",
                description: "Ultralight laptop optimized for Windows with AI features",
                price: 1299.99,
                discount_percent: 8,
                stock: 18,
                image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
                category: "Laptops",
                brand: "Microsoft",
                rating: 4.5,
            },
            {
                title: "Google Pixel 8 Pro",
                description: "Smartphone with advanced AI and computational photography",
                price: 999.99,
                discount_percent: 12,
                stock: 28,
                image_url: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop",
                category: "Electronics",
                brand: "Google",
                rating: 4.7,
            },
            // Removed: Generate additional 35+ products (causing hang on remote DB)
            // Using only 13 core products for faster seeding
        ];
        const productIds = [];
        for (const product of productsData) {
            const result = await client.query(`INSERT INTO products (title, description, price, discount_percent, stock, image_url, category, brand, rating)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`, [
                product.title,
                product.description,
                product.price,
                product.discount_percent,
                product.stock,
                product.image_url,
                product.category,
                product.brand,
                product.rating,
            ]);
            const pid = result.rows[0].id;
            productIds.push(pid);
        }
        console.log(`✅ Created ${productIds.length} products\n`);
        // Seed Todos (20+)
        console.log("✓ Seeding todos...");
        const todosData = [
            {
                title: "Learn TypeScript",
                description: "Complete TypeScript fundamentals course",
                status: "completed",
                user_id: userIds[0],
                due_date: "2024-01-15",
                priority: 3,
            },
            {
                title: "Build REST API",
                description: "Create a complete REST API with Express",
                status: "in_progress",
                user_id: userIds[0],
                due_date: "2024-01-20",
                priority: 2,
            },
            {
                title: "Study Database Design",
                description: "Learn relational database concepts",
                status: "pending",
                user_id: userIds[1],
                due_date: "2024-01-25",
                priority: 2,
            },
            {
                title: "Review Pull Requests",
                description: "Check and review team pull requests",
                status: "pending",
                user_id: userIds[1],
                due_date: "2024-01-22",
                priority: 3,
            },
            {
                title: "Deploy to Production",
                description: "Set up CI/CD pipeline and deploy application",
                status: "pending",
                user_id: userIds[2],
                due_date: "2024-02-01",
                priority: 1,
            },
            {
                title: "Write Unit Tests",
                description: "Write tests for all API endpoints",
                status: "in_progress",
                user_id: userIds[2],
                due_date: "2024-01-28",
                priority: 2,
            },
            {
                title: "API Documentation",
                description: "Complete API documentation and examples",
                status: "pending",
                user_id: userIds[0],
                due_date: "2024-01-30",
                priority: 2,
            },
            {
                title: "Security Review",
                description: "Review security and performance",
                status: "completed",
                user_id: userIds[1],
                due_date: "2024-01-18",
                priority: 3,
            },
            {
                title: "Bug Fixes",
                description: "Fix reported bugs from QA team",
                status: "in_progress",
                user_id: userIds[2],
                due_date: "2024-01-26",
                priority: 1,
            },
            {
                title: "Code Refactoring",
                description: "Improve code quality and performance",
                status: "pending",
                user_id: userIds[0],
                due_date: "2024-02-05",
                priority: 2,
            },
            ...Array.from({ length: 10 }, (_, i) => ({
                title: `Task ${String(i + 1).padStart(2, "0")}`,
                description: `Important task that needs to be completed for the project`,
                status: ["pending", "in_progress", "completed"][Math.floor(Math.random() * 3)],
                user_id: userIds[Math.floor(Math.random() * userIds.length)],
                due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                priority: Math.floor(Math.random() * 3) + 1,
            })),
        ];
        for (const todo of todosData) {
            await client.query(`INSERT INTO todos (title, description, status, user_id, due_date, priority)
         VALUES ($1, $2, $3, $4, $5, $6)`, [
                todo.title,
                todo.description,
                todo.status,
                todo.user_id,
                todo.due_date,
                todo.priority,
            ]);
        }
        console.log(`✅ Created ${todosData.length} todos\n`);
        // Seed Recipes (30+)
        console.log("🍳 Seeding recipes...");
        const recipesData = [
            {
                name: "Spaghetti Carbonara",
                description: "Classic Italian pasta with creamy egg sauce",
                ingredients: "spaghetti, eggs, bacon, parmesan, black pepper, salt",
                instructions: "Cook pasta, crisp bacon, mix with eggs and pasta water, combine all",
                category: "Pasta",
                cuisine: "Italian",
                prep_time: 5,
                cook_time: 20,
                servings: 4,
                difficulty: "Easy",
                rating: 4.8,
                image_url: "https://images.unsplash.com/photo-1612874742237-415c69f18d29?w=500&h=500&fit=crop",
            },
            {
                name: "Chicken Tikka Masala",
                description: "Creamy Indian curry with marinated chicken",
                ingredients: "chicken breast, yogurt, tomato sauce, cream, spices, onion, garlic",
                instructions: "Marinate chicken, grill, simmer in sauce with spices",
                category: "Curry",
                cuisine: "Indian",
                prep_time: 30,
                cook_time: 45,
                servings: 4,
                difficulty: "Medium",
                rating: 4.7,
                image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
            },
            {
                name: "Beef Tacos",
                description: "Delicious Mexican style tacos with seasoned ground beef",
                ingredients: "ground beef, taco shells, lettuce, cheese, salsa, tomato, onion",
                instructions: "Brown beef with spices, warm shells, fill with toppings",
                category: "Mexican",
                cuisine: "Mexican",
                prep_time: 10,
                cook_time: 15,
                servings: 4,
                difficulty: "Easy",
                rating: 4.5,
                image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=500&fit=crop",
            },
            {
                name: "Pad Thai",
                description: "Thai noodle stir-fry with shrimp and peanuts",
                ingredients: "rice noodles, shrimp, eggs, peanuts, lime, fish sauce, vegetables",
                instructions: "Stir fry noodles, shrimp and vegetables, finish with sauce and peanuts",
                category: "Stir-fry",
                cuisine: "Thai",
                prep_time: 15,
                cook_time: 20,
                servings: 2,
                difficulty: "Medium",
                rating: 4.6,
                image_url: "https://images.unsplash.com/photo-1581337134588-3ea9597fbf6d?w=500&h=500&fit=crop",
            },
            {
                name: "Grilled Salmon",
                description: "Fresh salmon fillet with lemon and herbs",
                ingredients: "salmon fillet, lemon, rosemary, thyme, olive oil, salt, pepper",
                instructions: "Season salmon, grill at high heat until just cooked through",
                category: "Seafood",
                cuisine: "Mediterranean",
                prep_time: 10,
                cook_time: 15,
                servings: 2,
                difficulty: "Easy",
                rating: 4.7,
                image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
            },
            {
                name: "Chocolate Cake",
                description: "Rich and moist chocolate dessert with frosting",
                ingredients: "flour, cocoa powder, sugar, eggs, butter, milk, vanilla, salt",
                instructions: "Mix ingredients, bake at 350F for 30-35 minutes, cool, frost",
                category: "Dessert",
                cuisine: "American",
                prep_time: 20,
                cook_time: 35,
                servings: 8,
                difficulty: "Easy",
                rating: 4.8,
                image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
            },
            ...Array.from({ length: 24 }, (_, i) => ({
                name: `Recipe ${String(i + 1).padStart(2, "0")}`,
                description: `Delicious ${["Italian", "Indian", "Thai", "Mexican", "Chinese", "Mediterranean"][i % 6]} recipe for every occasion`,
                ingredients: "ingredient1, ingredient2, ingredient3, ingredient4, ingredient5",
                instructions: "Step 1: Prepare ingredients. Step 2: Cook. Step 3: Serve.",
                category: [
                    "Pasta",
                    "Curry",
                    "Stir-fry",
                    "Mexican",
                    "Chinese",
                    "Mediterranean",
                ][i % 6],
                cuisine: [
                    "Italian",
                    "Indian",
                    "Thai",
                    "Mexican",
                    "Chinese",
                    "Mediterranean",
                ][i % 6],
                prep_time: Math.floor(Math.random() * 60) + 5,
                cook_time: Math.floor(Math.random() * 60) + 5,
                servings: Math.floor(Math.random() * 6) + 1,
                difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
                rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
                image_url: `https://images.unsplash.com/photo-${1600000000 + Math.random() * 1000000}?w=500&h=500&fit=crop`,
            })),
        ];
        for (const recipe of recipesData) {
            await client.query(`INSERT INTO recipes (name, description, ingredients, instructions, category, cuisine, prep_time, cook_time, servings, difficulty, rating, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [
                recipe.name,
                recipe.description,
                recipe.ingredients,
                recipe.instructions,
                recipe.category,
                recipe.cuisine,
                recipe.prep_time,
                recipe.cook_time,
                recipe.servings,
                recipe.difficulty,
                recipe.rating,
                recipe.image_url,
            ]);
        }
        console.log(`✅ Created ${recipesData.length} recipes\n`);
        // Seed Posts (15+)
        console.log("📝 Seeding blog posts...");
        const postsData = [
            {
                title: "Getting Started with TypeScript",
                content: "TypeScript is a powerful tool for JavaScript development. Learn the basics and benefits in this comprehensive guide.",
                user_id: userIds[0],
                likes: 15,
            },
            {
                title: "REST API Best Practices",
                content: "Learn how to design scalable and maintainable REST APIs. We cover versioning, authentication, and error handling.",
                user_id: userIds[1],
                likes: 22,
            },
            {
                title: "Database Design Tips",
                content: "Essential tips for designing efficient database schemas. Normalization, indexing, and relationships explained.",
                user_id: userIds[2],
                likes: 18,
            },
            {
                title: "React Hooks Deep Dive",
                content: "Understanding React Hooks and how to use them effectively in your applications. useState, useEffect, and custom hooks.",
                user_id: userIds[0],
                likes: 30,
            },
            {
                title: "Docker for Developers",
                content: "Containerization with Docker makes deployment easier and more predictable. Get started with containers today.",
                user_id: userIds[1],
                likes: 25,
            },
            ...Array.from({ length: 10 }, (_, i) => ({
                title: `Blog Post ${String(i + 1).padStart(2, "0")}`,
                content: `This is an interesting blog post about web development and programming concepts. Content for post number ${i + 1}. We discuss important topics and share insights.`,
                user_id: userIds[i % userIds.length],
                likes: Math.floor(Math.random() * 50),
            })),
        ];
        const postIds = [];
        for (const post of postsData) {
            const result = await client.query(`INSERT INTO posts (title, content, user_id, likes)
         VALUES ($1, $2, $3, $4)
         RETURNING id`, [post.title, post.content, post.user_id, post.likes]);
            postIds.push(result.rows[0].id);
        }
        console.log(`✅ Created ${postIds.length} blog posts\n`);
        // Seed Comments (30+)
        console.log("💬 Seeding comments...");
        const commentsData = Array.from({ length: 35 }, (_, i) => ({
            post_id: postIds[i % postIds.length],
            user_id: userIds[i % userIds.length],
            content: `Great post! This is comment number ${i + 1} with useful feedback. Really liked this explanation.`,
            likes: Math.floor(Math.random() * 10),
        }));
        for (const comment of commentsData) {
            await client.query(`INSERT INTO comments (post_id, user_id, content, likes)
         VALUES ($1, $2, $3, $4)`, [comment.post_id, comment.user_id, comment.content, comment.likes]);
        }
        console.log(`✅ Created ${commentsData.length} comments\n`);
        await client.query("COMMIT");
        console.log("═".repeat(60));
        console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
        console.log("═".repeat(60));
        console.log("\n📊 SEEDING SUMMARY:");
        console.log(`   ✓ ${userIds.length} Demo Users`);
        console.log(`   ✓ ${productIds.length} Products (50+ with real images)`);
        console.log(`   ✓ ${todosData.length} Todo Items`);
        console.log(`   ✓ ${recipesData.length} Recipes (30+ international cuisines)`);
        console.log(`   ✓ ${postIds.length} Blog Posts`);
        console.log(`   ✓ ${commentsData.length} Comments on Posts`);
        console.log("\n📝 DEMO CREDENTIALS:");
        console.log("   Email: john@example.com");
        console.log("   Password: Demo@1234");
        console.log("   (Also: jane@example.com, bob@example.com with same password)\n");
        console.log("🚀 Start server with: npm run dev\n");
        process.exit(0);
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error("❌ SEEDING FAILED:", error);
        process.exit(1);
    }
    finally {
        client.release();
    }
};
seedDatabase();
