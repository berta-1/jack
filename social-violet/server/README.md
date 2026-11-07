# Sphere Backend (Express + PostgreSQL + Prisma)

This is the backend service for **Sphere (Social Violet)** social network application.

---

## 🚀 Quick Start

### 1. Configure PostgreSQL Database
Open `.env` (or copy `.env.example` to `.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>?schema=public"
JWT_SECRET="your-secure-jwt-secret"
FRONTEND_URL="http://localhost:5173"
```

> **Hosted PostgreSQL Options:**
> - [Neon](https://neon.tech/) (free serverless Postgres)
> - [Supabase](https://supabase.com/) (free hosted Postgres)
> - [Railway](https://railway.app/) / AWS RDS / local PostgreSQL

### 2. Push Schema to Database
Synchronize the Prisma models with your PostgreSQL database:
```bash
npm run prisma:push
```

### 3. Seed Sample Data
Populate the database with sample users, posts, media, reactions, and notifications:
```bash
npm run db:seed
```

### 4. Start the Server
- **Development (with hot reload):**
  ```bash
  npm run dev
  ```
- **Production:**
  ```bash
  npm start
  ```
- **Prisma Studio (Visual Database GUI):**
  ```bash
  npm run prisma:studio
  ```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new account (`firstName`, `lastName`, `email`, `password`) |
| `POST` | `/api/auth/login` | Login with email and password |
| `POST` | `/api/auth/demo-login` | 1-click demo login (e.g. `berta.hule@example.com`) |
| `GET` | `/api/auth/me` | Fetch authenticated user info (`Bearer <token>`) |
| `GET` | `/api/auth/recent-accounts` | List accounts for the fast account switcher |

### 📝 Posts (`/api/posts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts?limit=20` | Get feed posts with media, reactions, and comment counts |
| `POST` | `/api/posts` | Create new post (supports text, colored cards, images) |
| `DELETE` | `/api/posts/:id` | Delete post (author only) |
| `POST` | `/api/posts/:id/react` | Toggle or change reaction (`like`, `love`, `care`, `haha`, `wow`, `sad`, `angry`) |
| `POST` | `/api/posts/:id/comments` | Add comment to a post |

### 📖 Stories (`/api/stories`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stories` | Get stories feed |
| `POST` | `/api/stories` | Create a new story |

### 🔔 Notifications (`/api/notifications`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | Get user notifications |
| `PATCH` | `/api/notifications/:id/read` | Mark single notification read |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications read |

### 👥 Users & Contacts (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/contacts` | Active contacts / friends list |
| `GET` | `/api/users/:id` | Get user profile and post count |
| `PUT` | `/api/users/profile` | Update profile information |

### 💬 Messages (`/api/messages`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/messages/:otherUserId` | Fetch conversation history |
| `POST` | `/api/messages` | Send a direct message |

