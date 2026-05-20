# Team Task Manager

A full-stack role-based task management system built with React, Node.js, Express, and MongoDB.

## Features

- JWT authentication (signup/login)
- Role-based access control (Admin / Member)
- Project management (create, edit, delete, assign members)
- Task management (create, assign, update, delete)
- Dashboard with statistics
- Responsive UI with Tailwind CSS

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

---

## Project Structure

```
ethara/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & error middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── utils/          # JWT helper
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Reusable UI components
        ├── context/    # Auth context
        └── pages/      # Route pages
```

---

## Installation

### Prerequisites
- Node.js >= 16
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable     | Description                        | Example                          |
|--------------|------------------------------------|----------------------------------|
| PORT         | Server port                        | 5000                             |
| MONGO_URI    | MongoDB connection string          | mongodb+srv://...                |
| JWT_SECRET   | Secret key for JWT signing         | mysecretkey                      |
| JWT_EXPIRE   | JWT expiry duration                | 7d                               |
| NODE_ENV     | Environment                        | development                      |
| CLIENT_URL   | Frontend URL for CORS (production) | https://your-app.vercel.app      |

### Frontend (`frontend/.env`)

| Variable       | Description       | Example                      |
|----------------|-------------------|------------------------------|
| VITE_API_URL   | Backend API URL   | http://localhost:5000/api    |

---

## API Routes

### Auth
| Method | Endpoint          | Access  | Description     |
|--------|-------------------|---------|-----------------|
| POST   | /api/auth/signup  | Public  | Register user   |
| POST   | /api/auth/login   | Public  | Login user      |
| GET    | /api/auth/me      | Private | Get current user|

### Projects
| Method | Endpoint              | Access       | Description          |
|--------|-----------------------|--------------|----------------------|
| GET    | /api/projects         | Private      | Get all projects     |
| POST   | /api/projects         | Admin only   | Create project       |
| GET    | /api/projects/:id     | Private      | Get project by ID    |
| PUT    | /api/projects/:id     | Admin only   | Update project       |
| DELETE | /api/projects/:id     | Admin only   | Delete project       |
| GET    | /api/projects/members | Admin only   | Get all members      |

### Tasks
| Method | Endpoint                      | Access       | Description           |
|--------|-------------------------------|--------------|-----------------------|
| GET    | /api/tasks/project/:projectId | Private      | Get tasks by project  |
| POST   | /api/tasks                    | Admin only   | Create task           |
| PUT    | /api/tasks/:id                | Private      | Update task           |
| DELETE | /api/tasks/:id                | Admin only   | Delete task           |

### Dashboard
| Method | Endpoint        | Access  | Description              |
|--------|-----------------|---------|--------------------------|
| GET    | /api/dashboard  | Private | Get dashboard statistics |

---

## Roles & Permissions

### Admin
- Full CRUD on projects and tasks
- Add/remove team members from projects
- View all tasks across all projects

### Member
- View only assigned projects and tasks
- Update only their own task status

---

## Deployment

### Backend → Render / Railway

1. Push backend to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env`

### Frontend → Vercel / Netlify

1. Push frontend to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set `VITE_API_URL` to your deployed backend URL
4. Deploy

### Database → MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist `0.0.0.0/0` for IP access (or your server IP)
4. Copy the connection string to `MONGO_URI` in backend `.env`

---

## Quick Start (Local)

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

App runs at: http://localhost:5173  
API runs at: http://localhost:5000
