# 🛒 FutureMart Backend (Multi-Vendor E-commerce)

## 🚀 Overview

FutureMart is a **role-based multi-vendor e-commerce backend system** built using Node.js, Express, and MongoDB.

It supports:

* 👤 **Customer** – Browse products and place orders
* 🏪 **Vendor** – Add/manage products and view orders
* 👑 **Admin** – Approve vendors and monitor platform

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 📁 Project Structure

```
src/
├── config/        # Database connection
├── models/        # User, Product, Order, StockLog
├── controllers/   # Business logic
├── routes/        # API routes
├── middlewares/   # Auth & role-based access
└── app.js

server.js
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### 3. Run server

```bash
npm run dev
```

---

# 🔐 Authentication Flow

1. Register user
2. Login → Get JWT token
3. Send token in headers:

```
Authorization: Bearer <token>
```

---

# 📡 COMPLETE API DOCUMENTATION

---

## 🔐 AUTH APIs

| Method | Endpoint           | Description                           |
| ------ | ------------------ | ------------------------------------- |
| POST   | /api/auth/register | Register user (admin/vendor/customer) |
| POST   | /api/auth/login    | Login & get token                     |
| GET    | /api/auth/me       | Get logged-in user                    |

---

## 👑 ADMIN APIs

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| GET    | /api/admin/vendors/pending     | Get unapproved vendors |
| PUT    | /api/admin/vendors/:id/approve | Approve vendor         |
| DELETE | /api/admin/vendors/:id/reject  | Reject vendor          |
| GET    | /api/admin/stats               | Platform statistics    |

---

## 📦 PRODUCT APIs

| Method | Endpoint                  | Access | Description         |
| ------ | ------------------------- | ------ | ------------------- |
| POST   | /api/products             | Vendor | Add product         |
| GET    | /api/products             | Public | Get all products    |
| GET    | /api/products/:id         | Public | Get single product  |
| PUT    | /api/products/:id         | Vendor | Update product      |
| DELETE | /api/products/:id         | Vendor | Delete product      |
| GET    | /api/products/my-products | Vendor | Get vendor products |

---

## 🛒 ORDER APIs

| Method | Endpoint               | Access       | Description               |
| ------ | ---------------------- | ------------ | ------------------------- |
| POST   | /api/orders            | Customer     | Place order               |
| GET    | /api/orders/my-orders  | Customer     | Get own orders            |
| GET    | /api/orders/vendor     | Vendor       | Get vendor-related orders |
| GET    | /api/orders            | Admin        | Get all orders            |
| PUT    | /api/orders/:id/status | Vendor/Admin | Update order status       |
| PUT    | /api/orders/:id/cancel | Customer     | Cancel order              |

---

# 🔄 ORDER PROCESS FLOW

```
1. Customer places order
2. System validates stock
3. Stock is reduced
4. Order is created
5. Vendor/Admin updates status:

Placed → Confirmed → Packed → Shipped → Delivered
```

---

# 🧠 CORE BUSINESS LOGIC

## ✅ Role-Based Access Control (RBAC)

* Customer → Orders
* Vendor → Products + Orders
* Admin → Full control

---

## ✅ Vendor Approval System

* Vendors cannot add products until approved by admin

---

## ✅ Stock Management

* Stock checked before order
* Stock reduced after order

---

## ✅ Order Lifecycle Control

* Strict step-by-step status updates
* Invalid transitions blocked

---

## ✅ Multi-Vendor Support

* Single order can include multiple vendor products
* Vendors see only their products in orders

---

## 🧪 Testing

Use Hoppscotch/Postman:

Headers:

```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## ⚠️ Common Errors

* ❌ Missing token → "Not authorized"
* ❌ Wrong role → "Access denied"
* ❌ Invalid order status → rejected
* ❌ Low stock → order blocked

---

## 💡 Assumptions

* Payment system not implemented
* Admin created manually
* No frontend included

---

## 🔮 Future Improvements

* Payment integration
* Order tracking UI
* Notifications system
* MongoDB transactions for atomic operations

---

## 👨‍💻 Author

Aman Sharma
MERN Stack Developer

---

## ⭐ Summary

This project demonstrates:

* Backend architecture
* Role-based authentication
* Real-world order system
* Inventory management

---
