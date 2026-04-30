# User Management & Auth Service

A production-grade Node.js backend focused on User Management, featuring an Event-Driven Architecture (EDA) and real-time notifications via WebSockets.

## 🚀 Key Features

-   **Authentication**: Secure JWT-based registration and login.
-   **Event-Driven Architecture (EDA)**: Decoupled business logic from side effects using a centralized Event Emitter.
-   **Real-Time Notifications**: Integrated Socket.IO for instant client updates.
-   **Advanced Caching**: Redis-backed multi-level caching for performance optimization.
-   **API Documentation**: Auto-generated Swagger documentation (protected by Basic Auth).
-   **Robust Validation**: Strict input validation using Zod schemas.
-   **Security**: Implementation of Helmet for secure headers, CORS, and Rate Limiting.
-   **Observability**: High-performance logging with Pino.

## 🛠 Tech Stack

-   **Runtime**: Node.js (v20+)
-   **Language**: TypeScript
-   **Framework**: Express.js
-   **Database**: PostgreSQL (TypeORM)
-   **Cache/Queue**: Redis
-   **Real-time**: Socket.IO
-   **Validation**: Zod
-   **Documentation**: Swagger (OpenAPI 3.0)

## 📦 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
-   Node.js (v20+)
-   PostgreSQL
-   Redis

### 2. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=edas_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your_super_secret_key

# Swagger Auth
SWAGGER_USER=admin
SWAGGER_PASSWORD=password
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Run migrations and start in development mode
npm run dev

# For production
npm run build
npm start
```

## 🏗 Architecture Overview

### Event-Driven Flow
The system follows a strict separation of concerns. Domain events are emitted from the **Service Layer**, allowing multiple subscribers to handle side effects without bloating the core business logic.

-   **Service**: Performs database operations and emits events (e.g., `USER_REGISTERED`).
-   **Socket Handler**: Listens for events and broadcasts real-time updates to connected clients.
-   **Cache Handler**: Listens for events to intelligently invalidate Redis caches.

### Socket.IO Structure
Clients can connect to the server and are automatically joined to a private room: `user:{userId}`. This allows targeted notifications to be sent to specific users securely.

## 🛣 API Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | Create a new user account |
| POST | `/api/v1/auth/login` | Authenticate and receive JWT |
| GET | `/api/v1/health` | System health check |
| GET | `/api/v1/docs` | Interactive API Documentation |

## 📡 Real-Time Events (Socket.IO)

-   **Event: `welcome`**: Sent to a user immediately after registration if they are connected.
    -   Payload: `{ "message": "Welcome...", "email": "..." }`

## 🧪 Tools

-   **Socket Monitor**: Access `http://localhost:3000/socket-monitor.html` to test real-time connectivity and events.
-   **API Docs**: Access `http://localhost:3000/api/v1/docs` for the interactive Swagger UI.

---
Created for EDA-based User Management Assignment.
