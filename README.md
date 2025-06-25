# AI Chat App

A full-stack AI-powered chat application with authentication, message history, and real-time interaction with an assistant. Built with React, Tailwind CSS, and a Node.js backend using NestJS, Prisma, and JWT authentication.

---

## 🔧 Tech Stack

### Frontend
- React + TypeScript
- React Router
- Axios
- Tailwind CSS

### Backend
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

---

## 🚀 Features

- 🔐 User registration & JWT login
- 🧠 Chat interface powered by Groq AI
- 💬 Persistent chat history
- 🎯 Protected routes with `PrivateRoute`
- 📜 Auto-growing input field
- 📦 Modular NestJS architecture
- 🧪 Backend E2E testing using Jest + Supertest

---

## 📁 Project Structure

```
.
├── backend               # NestJS + Prisma backend
│   ├── dist             # Compiled JS files
│   ├── prisma           # Prisma schema and migrations
│   ├── src              # Source code
│   │   ├── auth         # Auth module (login, register, guards, JWT strategy)
│   │   ├── chat         # Chat module (chat controller, service, groq integration)
│   │   ├── common       # Shared decorators
│   │   └── prisma       # Prisma service wrapper
│   ├── test             # E2E tests
│   ├── tsconfig*.json   # TS build configs
│   └── README.md
├── frontend              # React + Vite + Tailwind frontend
│   ├── public           # Static files
│   ├── src              # Source code
│   │   ├── api          # Axios config
│   │   ├── components   # Reusable UI components (Logout, PrivateRoute)
│   │   ├── hooks        # Custom React hooks (auth)
│   │   ├── pages        # Chat, Login, Register, NotFound
│   │   └── types        # Shared TypeScript types
│   ├── tailwind.config.js
│   ├── tsconfig*.json
│   └── README.md
└── README.md            # Root README
```


---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kongyim/ai-agent.git
cd ai-agent
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/chatdb
JWT_SECRET=your_jwt_secret
```

### Frontend `.env` (if needed)

```
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Running Tests

```bash
# Backend e2e tests
cd backend
npm run test:e2e
```

---

## 🧠 API Endpoints

| Method | Endpoint        | Description               |
|--------|------------------|---------------------------|
| POST   | `/auth/register` | Register a new user       |
| POST   | `/auth/login`    | Login and get JWT token   |
| GET    | `/chat/history`  | Get chat history          |
| POST   | `/chat`          | Send message to assistant |

---

## 📸 Screenshots

> _(Optional)_ Add a few screenshots here to showcase the UI.

---

## 📄 License

MIT License © 2025 Kong Yim

---

## 🙋‍♂️ Contributions

Pull requests are welcome! For major changes, please open an issue first.
