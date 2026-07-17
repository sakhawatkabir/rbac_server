# RBAC Server

A REST API built with Node.js, Express, TypeScript, and MongoDB that implements Role-Based Access Control (RBAC). It supports three user roles — **User**, **Manager**, and **Admin** — each with different levels of access across posts, categories, requests, and user management.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **File Uploads:** Multer + Cloudinary

---

## Roles & Permissions

| Resource         | User | Manager | Admin |
|------------------|:----:|:-------:|:-----:|
| View posts       | ❌   | ✅      | ✅    |
| Create/edit posts| ❌   | ✅      | ✅    |
| Delete posts     | ❌   | ✅      | ✅    |
| View categories  | ❌   | ✅      | ✅    |
| Manage categories| ❌   | ✅      | ✅    |
| Submit requests  | ✅   | ✅      | ✅    |
| Review requests  | ❌   | ✅      | ✅    |
| Manage users     | ❌   | ❌      | ✅    |
| Upload images    | ❌   | ✅      | ✅    |

---

## Project Structure

```
src/
├── config/
│   ├── db.ts              # MongoDB connection
│   └── cloudinary.ts      # Cloudinary upload config
├── controllers/           # Route handler logic
├── middleware/
│   └── auth.ts            # JWT protect + role authorize
├── models/
│   ├── User.ts
│   ├── Post.ts
│   ├── Category.ts
│   └── Request.ts
├── routes/                # Express routers
├── services/              # Business logic layer
├── types/
│   └── express.d.ts       # Extended Express Request type
├── seed.ts                # Database seeder
└── server.ts              # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)
- Cloudinary account

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Seed the database
npm run seed
```

---

## API Endpoints

All protected routes require an `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Path       | Access    | Description              |
|--------|------------|-----------|--------------------------|
| POST   | `/signup`  | Public    | Register a new user      |
| POST   | `/login`   | Public    | Login and receive JWT    |
| GET    | `/me`      | Protected | Get current user profile |
| PUT    | `/profile` | Protected | Update profile           |

### Posts — `/api/posts`

| Method | Path    | Access            | Description        |
|--------|---------|-------------------|--------------------|
| GET    | `/`     | Protected         | List all posts     |
| GET    | `/:id`  | Protected         | Get a single post  |
| POST   | `/`     | Manager, Admin    | Create a post      |
| PUT    | `/:id`  | Manager, Admin    | Update a post      |
| DELETE | `/:id`  | Manager, Admin    | Delete a post      |

### Categories — `/api/categories`

| Method | Path    | Access         | Description          |
|--------|---------|----------------|----------------------|
| GET    | `/`     | Protected      | List all categories  |
| POST   | `/`     | Manager, Admin | Create a category    |
| PUT    | `/:id`  | Manager, Admin | Update a category    |
| DELETE | `/:id`  | Manager, Admin | Delete a category    |

### Requests — `/api/requests`

Users can submit requests to be promoted to the Manager role.

| Method | Path    | Access         | Description                  |
|--------|---------|----------------|------------------------------|
| POST   | `/`     | Protected      | Submit a role upgrade request|
| GET    | `/my`   | Protected      | Get own requests             |
| GET    | `/all`  | Manager, Admin | Get all requests             |
| PUT    | `/:id`  | Manager, Admin | Approve or reject a request  |

### Users — `/api/users`

| Method | Path           | Access | Description         |
|--------|----------------|--------|---------------------|
| GET    | `/`            | Admin  | List all users      |
| GET    | `/:id`         | Admin  | Get a user          |
| PUT    | `/:id/role`    | Admin  | Update user role    |
| PUT    | `/:id/status`  | Admin  | Update user status  |
| DELETE | `/:id`         | Admin  | Delete a user       |

### Upload — `/api/upload`

| Method | Path            | Access    | Description                    |
|--------|-----------------|-----------|--------------------------------|
| POST   | `/avatar`       | Protected | Upload a user avatar (Cloudinary) |
| POST   | `/post`         | Protected | Upload a post image (Cloudinary)  |
| DELETE | `/:publicId`    | Protected | Delete an image from Cloudinary   |

---

## Data Models

**User** — `name`, `email`, `password` (hashed), `role` (User/Manager/Admin), `department`, `status` (Active/Inactive/Suspended), `avatar`

**Post** — `title`, `content`, `category`, `status` (Draft/Published), `image`, `author` (ref User)

**Category** — `name`, `color`, `createdBy` (ref User)

**Request** — `user` (ref User), `requestedRole` (Manager), `status` (Pending/Approved/Rejected), `currentRole`, `flagged`
