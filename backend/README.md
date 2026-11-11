# WORLDLY Backend API

RESTful backend service for **WORLDLY - Global Explorer & Atlas**, built with **Node.js**, **Express.js**, and **MongoDB / Mongoose**.

---

## 🚀 Quick Start

### 1. Installation
Navigate into the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/worldly
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Database Options
- **Local MongoDB**: Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017/worldly`.
- **MongoDB Atlas (Cloud)**: Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), create a database user and whitelist your IP, then set:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/worldly?retryWrites=true&w=majority
  ```
- **Automatic In-Memory Fallback**: If no local or cloud MongoDB instance is reachable in development mode, the server automatically starts an isolated in-memory MongoDB instance (`mongodb-memory-server`) so you can run, test, and develop immediately without installing MongoDB service.

### 4. Running the Server
```bash
# Start server with auto-seeding
npm start

# Development mode with hot-reload (nodemon)
npm run dev

# Run automated integration test suite
npm test
```

The server will start on: **`http://localhost:5000`**  
API Documentation / root route: **`http://localhost:5000/`**

---

## 🔑 Demo Account

The database seeds automatically on initial startup with:
- **Email**: `explorer@worldly.atlas`
- **Password**: `password123`
- **Role**: `cartographer`

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login with email and password, returns JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile, streak, and XP |
| `PUT` | `/api/auth/profile` | Private | Update user display name or avatar |

### 2. Research Tasks & Expeditions (`/api/tasks`)
*All task endpoints require `Authorization: Bearer <token>`.*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks for user (supports `?status=`, `?priority=`, `?countryId=`, `?search=`) |
| `POST` | `/api/tasks` | Create task (`title`, `description`, `countryId`, `category`, `priority`, `dueDate`) |
| `GET` | `/api/tasks/:id` | Get single task details |
| `PUT` | `/api/tasks/:id` | Update task (`title`, `description`, `status`, `priority`, etc.) |
| `DELETE` | `/api/tasks/:id` | Delete task |

### 3. Country Dossiers (`/api/countries`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/countries` | Public | List all country dossiers (supports `?region=`, `?search=`) |
| `GET` | `/api/countries/:id` | Public | Get single country profile (e.g. `/api/countries/japan`) |

### 4. Bookmarks & Saved Atlas (`/api/bookmarks`)
*Requires `Authorization: Bearer <token>`.*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bookmarks` | Retrieve all bookmarked countries and details for logged-in user |
| `POST` | `/api/bookmarks/:countryId` | Add or toggle bookmark for a country |
| `DELETE` | `/api/bookmarks/:countryId` | Remove country from bookmarks |

### 5. Daily Geo Quiz (`/api/quiz`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/quiz/daily` | Public | Get current daily questions |
| `POST` | `/api/quiz/answer` | Public / Private | Submit answer (`questionId`, `optionId`), awards XP to user |

---

## 🔒 Security & Best Practices
- **Password Hashing**: `bcryptjs` with salt rounds (10) via Mongoose pre-save hook.
- **JWT Protection**: Signed JSON Web Tokens with configurable expiration (`JWT_EXPIRES_IN`).
- **Input Validation**: `express-validator` middleware checks request bodies and parameters.
- **CORS Protection**: Restricted to configured frontend origin (`CLIENT_URL`).
- **No Secret Leakage**: Passwords omitted via Mongoose `select: false` on User schema.

