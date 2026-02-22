# Quick API Reference

Base URL: `http://localhost:3000`

## Authentication

All protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

## User Endpoints

### Register
```
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "confirm_password": "SecurePass@123"
}
```

### Login
```
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```
Returns: `{ token, user }`

### Get Profile
```
GET /user/profile
Authorization: Bearer <token>
```

### Update Profile
```
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA"
}
```

### Change Password
```
POST /user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "OldPass@123",
  "new_password": "NewPass@456"
}
```

---

## Product Endpoints

### Get All Products
```
GET /products?page=1&limit=12&category_id=1&search=phone&sort=newest
```
Sort options: `newest`, `price_low`, `price_high`, `rating`

### Get Single Product
```
GET /products/:id
```

### Create Product (Admin)
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 999.99,
  "discount_price": 899.99,
  "category_id": 1,
  "stock_quantity": 100,
  "sku": "PROD-001"
}
```

### Update Product (Admin)
```
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 799.99,
  "stock_quantity": 50
}
```

### Delete Product (Admin)
```
DELETE /products/:id
Authorization: Bearer <token>
```

### Add Product Review
```
POST /products/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product!"
}
```

### Get Categories
```
GET /products/categories/all
```

### Create Category (Admin)
```
POST /products/categories/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

---

## Cart Endpoints

All cart endpoints require authentication.

### Get Cart
```
GET /cart
Authorization: Bearer <token>
```

### Add to Cart
```
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

### Update Cart Item
```
PUT /cart/:product_id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart
```
DELETE /cart/:product_id
Authorization: Bearer <token>
```

### Clear Cart
```
DELETE /cart
Authorization: Bearer <token>
```

---

## Order Endpoints

All order endpoints require authentication.

### Create Order
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shipping_address": "123 Main St, New York, NY 10001",
  "payment_method": "credit_card"
}
```
Payment methods: `credit_card`, `debit_card`, `paypal`, `upi`

### Get User's Orders
```
GET /orders?page=1&limit=10
Authorization: Bearer <token>
```

### Get Order Details
```
GET /orders/:id
Authorization: Bearer <token>
```

### Cancel Order
```
POST /orders/:id/cancel
Authorization: Bearer <token>
```

### Get All Orders (Admin)
```
GET /orders/admin/all?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### Update Order Status (Admin)
```
PUT /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped",
  "tracking_number": "TRACK123"
}
```
Statuses: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Server Error

---

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Filtering
- `category_id` - Filter by category
- `search` - Search products by name/description
- `sort` - Sort products
- `status` - Filter orders by status

---

## Useful cURL Examples

### Login and Get Token
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'
```

### Get Products
```bash
curl http://localhost:3000/products
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/cart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'
```

### Create Order
```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shipping_address":"123 Main St","payment_method":"credit_card"}'
```

---

## Database Setup Commands

### Create Database
```bash
createdb ecommerce
```

### Run Schema
```bash
psql -U postgres -d ecommerce -f src/database.sql
```

### Seed Sample Data
```bash
npm run seed
```

---

## Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Compile TypeScript
npm start             # Run production build
npm run seed          # Populate sample data
npm run clean         # Remove build files
npm run type-check    # Check TypeScript
```

---

## Demo Credentials

```
Email: admin@example.com
Password: Admin@123456

OR

Email: john@example.com
Password: John@123456
```

---

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
PORT=3000
NODE_ENV=development
SECRET_PRIVATE_KEY=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

---

## Tips

1. **Always include Content-Type header**: `Content-Type: application/json`
2. **Use Bearer token correctly**: `Authorization: Bearer <token>` (not `Token`)
3. **Check pagination**: Use `page` and `limit` for large datasets
4. **Validate input**: Errors return validation details
5. **Save token**: From login response to use in protected routes
6. **Character limits**: Some fields have max length restrictions
7. **Password requirements**: Min 8 chars, uppercase, lowercase, number, special char

---

For complete documentation, see [README.md](./README.md)
