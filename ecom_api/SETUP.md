# E-Commerce API - Setup Guide

This guide will help you set up and run the complete e-commerce backend API.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Usually comes with Node.js

### Verify Installation

```bash
node --version
npm --version
psql --version
```

---

## Step 1: Clone/Extract Project

Extract the project to your desired location:

```bash
cd ecom_api
```

---

## Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- Express.js - Web framework
- PostgreSQL driver - Database connection
- JWT - Authentication
- Bcryptjs - Password hashing
- Joi - Input validation
- Helmet - Security headers
- CORS - Cross-origin support
- Rate Limiting - Abuse prevention
- And development dependencies

---

## Step 3: Setup Database

### Option A: Automatic Setup (Recommended)

#### On macOS/Linux:

```bash
chmod +x setup-db.sh
./setup-db.sh
```

#### On Windows (PowerShell):

Run the SQL commands manually (see Option B)

### Option B: Manual Setup

#### 1. Create PostgreSQL Database

Open PostgreSQL command prompt or use psql:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ecommerce;

# Exit psql
\q
```

#### 2. Run Database Schema

```bash
# Replace with your credentials
psql -U postgres -d ecommerce -f src/database.sql
```

This creates all necessary tables with proper relationships and indexes.

---

## Step 4: Configure Environment

### 1. Create .env file

Copy the example file:

```bash
cp .env.example .env
```

### 2. Update .env with Your Configuration

Edit `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ecommerce

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (Use a strong, random string minimum 32 characters)
SECRET_PRIVATE_KEY=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_VERSION=1.0.0
```

### Important: Update Database Credentials

Replace the following in `DATABASE_URL`:
- `postgres` - Your PostgreSQL username
- `your_password` - Your PostgreSQL password
- `localhost` - Your database host (usually localhost for local development)
- `5432` - PostgreSQL port (default is 5432)

---

## Step 5: Seed Sample Data (Optional but Recommended)

Populate the database with sample products, categories, and users:

```bash
npx ts-node src/seed.ts
```

This will create:
- ✅ 6 product categories
- ✅ 20 sample products with details
- ✅ 3 demo users
- ✅ 8 sample product reviews

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `Admin@123456`

Or use:
- Email: `john@example.com`
- Password: `John@123456`

---

## Step 6: Start Development Server

```bash
npm run dev
```

You should see:

```
🚀 Server is running on port 3000
📍 Environment: development
```

The API is now running at: **http://localhost:3000**

---

## Verify Installation

Test the API by visiting or making a GET request to:

```
GET http://localhost:3000
```

You should receive:

```json
{
  "success": true,
  "message": "E-commerce API Server is running",
  "version": "1.0.0",
  "endpoints": {
    "users": "/user",
    "products": "/products",
    "cart": "/cart",
    "orders": "/orders"
  }
}
```

---

## Common Setup Issues

### Issue: "Can't find module 'express'"

**Solution:**
```bash
npm install
```

### Issue: "database connection failed"

**Check:**
1. PostgreSQL is running
2. DATABASE_URL is correct
3. Database exists: `psql -U postgres -c "\l"`
4. User has permissions

**Fix:**
```bash
# Verify connection
psql -U postgres -d ecommerce
```

### Issue: "role 'postgres' does not exist"

**Solution:**
```bash
# List PostgreSQL users
psql -U postgres -c "\du"

# Create new user if needed
psql -U postgres -c "CREATE USER ecom_user WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecom_user;"
```

### Issue: "SECRET_PRIVATE_KEY is not configured"

**Solution:**
Add to `.env`:
```env
SECRET_PRIVATE_KEY=your_super_secret_key_minimum_32_characters
```

---

## Project Structure

```
ecom_api/
├── src/
│   ├── controllers/          # Business logic
│   │   ├── userController.ts
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   └── orderController.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   └── errorHandler.ts  # Error handling
│   ├── routes/              # API route definitions
│   │   ├── users.route.ts
│   │   ├── products.route.ts
│   │   ├── cart.route.ts
│   │   └── order.route.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── user.ts
│   │   └── product.ts
│   ├── utils/               # Utility functions
│   │   ├── validation.ts    # Joi schemas
│   │   └── helpers.ts       # Helper functions
│   ├── db.ts                # Database connection
│   ├── seed.ts              # Sample data seeding
│   ├── index.ts             # Main server file
│   └── database.sql         # SQL schema
├── dist/                    # Compiled JavaScript
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── .env                     # Environment variables
├── .env.example             # Example env file
├── README.md                # API documentation
├── SETUP.md                 # This file
└── setup-db.sh              # Database setup script
```

---

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Seed database with sample data
npx ts-node src/seed.ts

# Clear and reseed database
npm run dev
# Then run seed in another terminal
```

---

## Testing the API

### Using cURL

#### Register a new user:
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass@123",
    "confirm_password": "TestPass@123"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass@123"
  }'
```

#### Get products:
```bash
curl http://localhost:3000/products
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import the API endpoints (create a collection)
3. Set base URL to `http://localhost:3000`
4. Test each endpoint

### Using VS Code REST Client

Create a file `requests.rest`:

```http
### Get Products
GET http://localhost:3000/products

### Register User
POST http://localhost:3000/user/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass@123",
  "confirm_password": "TestPass@123"
}

### Login
POST http://localhost:3000/user/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass@123"
}
```

---

## Next Steps

1. **Read API Documentation** - See [README.md](./README.md)
2. **Add Frontend** - Build a React, Vue, or Angular frontend
3. **Deploy** - Deploy to Heroku, AWS, or DigitalOcean
4. **Add Payment Integration** - Stripe, PayPal, etc.
5. **Add Email Service** - SendGrid, Mailgun for notifications
6. **Monitor** - Setup logging and monitoring

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `SECRET_PRIVATE_KEY` | JWT signing key | Any random secure string (32+ chars) |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

---

## Security Reminders

⚠️ **Never commit sensitive data:**
- Never push `.env` file to git
- Add `.env` to `.gitignore`
- Use environment variables for secrets
- Change `SECRET_PRIVATE_KEY` in production

✅ **Security best practices implemented:**
- Password hashing with bcryptjs
- JWT token authentication
- Input validation with Joi
- SQL injection prevention
- CORS protection
- Rate limiting
- Security headers with Helmet
- Error handling without exposing internals

---

## Helpful Resources

- **Node.js** - https://nodejs.org/docs/
- **Express.js** - https://expressjs.com/
- **PostgreSQL** - https://www.postgresql.org/docs/
- **TypeScript** - https://www.typescriptlang.org/docs/
- **JWT** - https://jwt.io/
- **Bcryptjs** - https://github.com/dcodeIO/bcrypt.js

---

## Support and Troubleshooting

If you encounter issues:

1. Check the console output for error messages
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check that ports are not in use
5. Review the FAQ section above

---

## What's Next?

Your e-commerce API is now ready to use! You can:

- ✅ Create and manage products
- ✅ Handle user authentication
- ✅ Manage shopping carts
- ✅ Process orders
- ✅ Manage reviews and ratings
- ✅ Scale and customize further

Happy coding! 🚀
