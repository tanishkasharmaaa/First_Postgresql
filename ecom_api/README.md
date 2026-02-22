# Fake JSON API — Learners Edition

Lightweight, multi-purpose Fake JSON API implemented with Node.js, Express and PostgreSQL for learning and experimentation. It provides sample endpoints and seeded data for: users, products (with images), todos, recipes, posts and comments.

This repository is intended for students and learners who want a realistic back-end to practice HTTP requests, authentication, pagination, filtering, and database seeding.

## What's included
- User auth & profiles (JWT)
- Products with images (primary image on product + multiple entries in `product_images`)
- Todo items per user
- Recipes (ingredients, instructions, cuisine)
- Blog posts and comments
- Seed script to populate demo data
- TypeScript + Express boilerplate with Joi validation and basic security middleware

## Quick Start
1. Install dependencies

```bash
cd ecom_api
npm install
```

2. Create the database and run schema

You can run `src/database.sql` from pgAdmin or with `psql`:

```bash
# Example (replace values):
psql -h localhost -p 5432 -U postgres -d mydb -f src/database.sql
```

3. Configure environment

Copy `.env.example` to `.env` and update `DATABASE_URL`, `PORT`, `SECRET_PRIVATE_KEY`, etc.

4. Seed sample data

```bash
# install ts-node if not available
npx ts-node src/seed.ts
```

5. Start dev server

```bash
npm run dev
```

Server base URL: http://localhost:3000

## Seeded demo credentials
- Email: john@example.com / Password: Demo@1234
- Email: jane@example.com / Password: Demo@1234
- Email: bob@example.com / Password: Demo@1234

## API Endpoints (high level)

Base URL: `/`

- `POST /user/register` — register new user
- `POST /user/login` — login and receive JWT
- `GET /user/profile` — protected: current user profile

- `GET /products` — list products with pagination and filters
  - query: `page`, `limit`, `search`, `category`, `brand`, `sort`
- `GET /products/:id` — product details (includes `image_url`)
- `GET /products/:id/images` — list images from `product_images`
- `GET /products/categories/all` — list categories (string field)
- `POST /products` — create product (admin in demo)

- `GET /todos` — list todos (filter by `user_id`)
- `POST /todos` — create todo
- `PUT /todos/:id` — update todo
- `DELETE /todos/:id` — delete todo

- `GET /recipes` — list recipes with filters (cuisine/category)
- `GET /recipes/:id` — recipe details
- `POST /recipes` — create recipe

- `GET /posts` — list blog posts
- `GET /posts/:id` — post details with comments
- `POST /posts` — create post
- `POST /posts/:id/comments` — add comment to post

All protected endpoints expect `Authorization: Bearer <token>` header.

## Database notes
- Schema file: `src/database.sql` creates tables: `users`, `products`, `todos`, `recipes`, `posts`, `comments`, and `product_images` (supports multiple images per product).
- Indexes are included for common filters and join keys.

## Seeding behavior
- `src/seed.ts` will:
  - create 3 demo users (john, jane, bob)
  - create ~60-100 products with `image_url` set on the product and 1–3 entries in `product_images` per product
  - create todos, recipes, posts and comments to populate the API for testing

Run the seed script once the schema is applied and `.env` is configured.

## Common commands

Install dev tooling:
```bash
npm install --save-dev ts-node typescript
```

Run seed:
```bash
npx ts-node src/seed.ts
```

Run the server (dev):
```bash
npm run dev
```

Verify products count (psql example):
```bash
psql -h localhost -U postgres -d mydb -c "SELECT COUNT(*) FROM products;"
psql -h localhost -U postgres -d mydb -c "SELECT COUNT(*) FROM product_images;"
```

## Notes for learners
- The API is a sandbox for learning — safe to inspect and modify seed data.
- `product_images` stores multiple images; `products.image_url` holds a primary image for quick responses.
- Use the seed credentials to sign in and explore protected routes.

If you'd like, I can also update `FEATURES.md`, `SETUP.md` and `QUICK_REFERENCE.md` to match these changes. Shall I proceed?

---
Generated: February 22, 2026
