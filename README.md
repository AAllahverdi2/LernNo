# 🚀 LernNo — AI-Powered Language Learning Workspace (Full-Stack Monorepo)

LernNo is a modern, high-performance Full-Stack SaaS application built for language teachers, students, and platform administrators. It provides interactive vocabulary set management, Web Speech API audio pronunciation, 3D flashcards, adaptive quizzes, role-based authentication, real-time analytics, and AI-assisted vocabulary generation.

---

## 🛠️ Full-Stack Technology Stack

### **Backend (`/backend`)**
* **Runtime & Language**: Node.js (ES Modules), TypeScript
* **Framework**: Express.js RESTful API
* **Database**: PostgreSQL on **Supabase Cloud**
* **ORM**: Prisma ORM (v6) with migration control & seeders
* **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing
* **Security & Access**: Custom Role-Based Access Control (RBAC) middleware (`TEACHER`, `STUDENT`, `ADMIN`)
* **API Documentation**: Interactive **Swagger UI (OpenAPI 3.0)**

### **Frontend (`/frontend`)**
* **Framework & Build Tool**: React 19, TypeScript, Vite
* **Styling & UI Design**: Tailwind CSS (v3), Custom 3D Perspective Utilities, Glassmorphism
* **Icons & Components**: Lucide React, Modular Design System (StatCards, Badges, Modals, Tables, Audio Players)
* **State & Data Fetching**: TanStack Query (React Query v5), React Router v7
* **Audio & Speech**: Browser Web Speech API SpeechSynthesis (`de-DE` TTS)

---

## 📁 Repository Structure

```
LernNo/
├── backend/                  # Node.js Express REST API + Prisma ORM + Swagger UI
│   ├── prisma/               # Schema definitions & database seeders
│   ├── src/
│   │   ├── config/           # Database & Swagger configurations
│   │   ├── controllers/      # Auth & Admin business logic
│   │   ├── middleware/       # JWT verification & Role guards
│   │   ├── routes/           # Express API route modules
│   │   └── server.ts         # Express server entry point
│   ├── package.json
│   └── vercel.json           # Serverless deployment configuration
└── frontend/                 # React + TypeScript + Vite Frontend MVP
    ├── src/
    │   ├── components/       # Design System & Feature modules
    │   ├── context/          # Auth & Role management context
    │   ├── hooks/            # TanStack Query custom data hooks
    │   ├── pages/            # Role-routed application views
    │   └── services/         # Async REST API client services
    ├── package.json
    └── vite.config.ts
```

---

## 🔐 User Roles & Permissions

1. **`TEACHER` (Məllim)** — Create & manage classes, publish vocabulary sets, import words via spreadsheet grid, use AI generation, track student completion rates.
2. **`STUDENT` (Tələbə)** — Access daily assigned lessons, listen to native audio pronunciations, flip 3D flashcards, complete adaptive quizzes, maintain daily practice streaks.
3. **`ADMIN` (Platform Administrator)** — Full system oversight, user directory management, role promotion, and performance analytics.

---

## 📚 API Endpoints & Swagger Documentation

Interactive Swagger UI documentation is served live at `/api-docs`.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status health check |
| `POST` | `/api/auth/register` | Public | Register new user (Teacher/Student/Admin) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return 7-day JWT Token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user profile details |
| `GET` | `/api/admin/users` | Admin Only | View list of all registered accounts |
| `POST` | `/api/admin/change-role` | Admin Only | Update user permission role |

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/LernNo.git
cd LernNo
```

### 2. Start Backend API
```bash
cd backend
npm install
npx prisma db push
npm run dev
```
*Backend API server starts at `http://localhost:5000`*  
*Swagger UI available at `http://localhost:5000/api-docs`*

### 3. Start Frontend Workspace
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend app starts at `http://localhost:5176`*
