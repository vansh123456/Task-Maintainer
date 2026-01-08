# Task Management Application

A full-stack task management web application built with Next.js, Express, PostgreSQL, and Cloudinary. Features user authentication, task CRUD operations, profile management, and image uploads.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Architecture Decisions](#architecture-decisions)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Scaling to Microservices](#scaling-to-microservices)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Image Optimization**: Next.js Image Component

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: PostgreSQL (NeonDB - Hosted)
- **Authentication**: JWT (HTTP-only cookies)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary

## 📁 Project Structure

```
judix/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── taskController.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── models/            # Database models
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js
│   │   ├── db/                # Database layer
│   │   │   ├── db.js          # Connection pool
│   │   │   ├── initDb.js      # Schema initialization
│   │   │   └── addProfilePictureColumn.js
│   │   ├── utils/             # Utility functions
│   │   │   └── cloudinary.js
│   │   └── index.js           # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/        # Reusable components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── SuccessMessage.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── contexts/          # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── lib/               # Utilities & services
│   │   │   └── api.ts         # API client
│   │   └── types/             # TypeScript types
│   │       └── index.ts
│   ├── next.config.ts
│   └── package.json
│
└── README.md
```

## ✨ Features

### Authentication
- ✅ User registration with validation
- ✅ User login with JWT
- ✅ JWT stored in HTTP-only cookies (secure)
- ✅ Protected routes middleware
- ✅ Automatic token refresh handling

### User Management
- ✅ View user profile
- ✅ Update profile (name, email)
- ✅ Upload profile picture (Cloudinary)
- ✅ Profile picture display with fallback to initials

### Task Management
- ✅ Create tasks (title, description, status)
- ✅ Read tasks with filters
- ✅ Update tasks
- ✅ Delete tasks
- ✅ Search tasks (by title/description)
- ✅ Filter tasks by status (pending, in_progress, completed)
- ✅ Real-time search with debouncing

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Two-sided login/register pages
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling and validation
- ✅ Success notifications

## 🏗 Architecture Decisions

### 1. Monolithic Backend (MVC Pattern)

**Decision**: Single Express.js server with MVC architecture

**Rationale**:
- Simpler development and deployment for initial version
- Easier debugging and testing
- Lower operational complexity
- Sufficient for MVP and small-to-medium scale

**Trade-offs**:
- All services share resources
- Single point of failure
- Scalability limitations at high traffic
- Tight coupling between features

### 2. Database: Single PostgreSQL Database

**Decision**: Single database with normalized schema

**Rationale**:
- ACID compliance for user and task data
- Strong referential integrity
- Efficient joins for related data
- Cost-effective for initial scale

**Trade-offs**:
- Vertical scaling required
- Database becomes bottleneck at scale
- All services share same database instance

### 3. Authentication: JWT in HTTP-only Cookies

**Decision**: JWT tokens stored in HTTP-only cookies, not localStorage

**Rationale**:
- **Security**: HTTP-only cookies prevent XSS attacks (JavaScript can't access)
- **Automatic transmission**: Cookies sent automatically with requests
- **No client-side token management**: Simpler frontend code
- **SameSite protection**: CSRF protection available

**Trade-offs**:
- Requires CORS configuration
- Slightly more complex cookie management
- Cookie size limitations

### 4. File Storage: Cloudinary

**Decision**: Use Cloudinary for image storage and optimization

**Rationale**:
- Automatic image optimization (format, size, quality)
- CDN delivery for fast global access
- Image transformations (resize, crop, face detection)
- No infrastructure management needed
- Generous free tier

### 5. Frontend: Next.js App Router with Client Components

**Decision**: Next.js App Router with client-side state management

**Rationale**:
- Server-side rendering capabilities when needed
- Modern React patterns (Server Components potential)
- Built-in routing and optimization
- TypeScript support out of the box
- Good developer experience

### 6. API Communication: RESTful API

**Decision**: RESTful API with JSON responses

**Rationale**:
- Simple and widely understood
- Easy to document and test
- Works well with HTTP methods
- Good browser support

**Future Consideration**: GraphQL could be added for complex queries

### 7. Error Handling: Centralized Middleware

**Decision**: Single error handling middleware

**Rationale**:
- Consistent error responses
- Single place to modify error format
- Production-safe error messages
- Easier debugging with stack traces in development

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (NeonDB account recommended)
- Cloudinary account (for profile pictures)
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   PORT=5001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   # NeonDB PostgreSQL
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRES_IN=7
   
   # Cloudinary (optional - for profile pictures)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Initialize database**:
   ```bash
   npm run init-db
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   # Create .env.local
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:3000`

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-01-06T08:46:27.722Z"
    }
  }
}
```

#### POST /api/auth/login
Login user.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200): Sets HTTP-only cookie with JWT token

#### POST /api/auth/logout
Logout user (clears cookie).

### User Endpoints (Protected)

#### GET /api/user/profile
Get authenticated user's profile.

**Headers**: Cookie with JWT token

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "https://res.cloudinary.com/...",
      "createdAt": "2026-01-06T08:46:27.722Z"
    }
  }
}
```

#### PUT /api/user/profile
Update user profile.

**Request Body**:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### POST /api/user/profile/picture
Upload profile picture.

**Request**: multipart/form-data
- `profilePicture`: Image file (max 5MB)

### Task Endpoints (Protected)

#### POST /api/tasks
Create a new task.

**Request Body**:
```json
{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "in_progress"
}
```

#### GET /api/tasks
Get all tasks for authenticated user.

**Query Parameters**:
- `status` (optional): Filter by status (pending, in_progress, completed)
- `search` (optional): Search in title and description

**Example**: `/api/tasks?status=completed&search=project`

#### PUT /api/tasks/:id
Update a task.

**Request Body**:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

#### DELETE /api/tasks/:id
Delete a task.

## 🔄 Scaling to Microservices

The current monolithic architecture can be refactored into microservices when scaling becomes necessary. Here's a recommended approach:

### Proposed Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway                             │
│              (Kong, AWS API Gateway, etc.)                  │
└─────────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │  Auth   │    │  User   │    │  Task   │
    │ Service │    │ Service │    │ Service │
    └────┬────┘    └────┬────┘    └────┬────┘
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │  User   │    │  User   │    │  Task   │
    │   DB    │    │   DB    │    │   DB    │
    └─────────┘    └─────────┘    └─────────┘
```

### Step-by-Step Migration Plan

#### Phase 1: Service Extraction

**1. Authentication Service**
- **Responsibility**: User authentication, JWT token generation/validation
- **Database**: Users table (only auth-related fields: email, password)
- **APIs**: 
  - POST /auth/register
  - POST /auth/login
  - POST /auth/logout
  - POST /auth/validate-token (internal)
- **Communication**: JWT token validation via internal API calls

**2. User Service**
- **Responsibility**: User profile management, profile pictures
- **Database**: User profiles table (id, name, profile_picture)
- **APIs**:
  - GET /users/:id/profile
  - PUT /users/:id/profile
  - POST /users/:id/profile/picture
- **Communication**: Receives user ID from authenticated token

**3. Task Service**
- **Responsibility**: Task CRUD operations
- **Database**: Tasks table (with user_id reference)
- **APIs**:
  - GET /tasks (with user_id from token)
  - POST /tasks
  - PUT /tasks/:id
  - DELETE /tasks/:id
- **Communication**: Validates user ownership via user_id

#### Phase 2: Infrastructure Changes

**1. API Gateway**
- **Purpose**: Single entry point, routing, rate limiting, authentication
- **Options**:
  - Kong
  - AWS API Gateway
  - NGINX
  - Traefik
- **Responsibilities**:
  - Route requests to appropriate services
  - Validate JWT tokens (call Auth Service)
  - Load balancing
  - Request/response transformation

**2. Service Communication**
- **Synchronous**: HTTP/REST for real-time operations
- **Asynchronous**: Message queue (RabbitMQ, AWS SQS) for:
  - User deletion → Notify Task Service
  - Profile updates → Cache invalidation
- **Service Discovery**: Consul, Eureka, or Kubernetes DNS

**3. Database Strategy**
- **Database per Service**: Each service owns its database
- **User Service DB**: User profiles, profile pictures metadata
- **Task Service DB**: Tasks, task metadata
- **Auth Service DB**: User credentials, JWT blacklist
- **Data Consistency**: Event-driven architecture for eventual consistency

**4. Message Queue Integration**

```javascript
// Example: User deletion event
// Auth Service publishes event
await messageQueue.publish('user.deleted', {
  userId: 123,
  timestamp: Date.now()
});

// Task Service subscribes
messageQueue.subscribe('user.deleted', async (event) => {
  await TaskService.deleteAllUserTasks(event.userId);
});
```


### Example: Refactored Service Structure

```
services/
├── api-gateway/          # Entry point, routing
├── auth-service/         # Authentication only
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/       # User credentials
│   │   └── services/     # JWT service
│   └── Dockerfile
├── user-service/         # User profiles
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/       # User profiles
│   │   └── services/     # Profile service
│   └── Dockerfile
├── task-service/         # Task management
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/       # Tasks
│   │   └── services/     # Task service
│   └── Dockerfile
└── shared/
    ├── auth-middleware/  # JWT validation
    ├── error-handler/    # Common errors
    └── logger/           # Logging utilities
```

## 🔒 Security Considerations

### Current Implementation
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT in HTTP-only cookies (XSS protection)
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ Error message sanitization in production

### Production Recommendations
- [ ] Rate limiting (express-rate-limit)
- [ ] Helmet.js for security headers
- [ ] HTTPS enforcement
- [ ] CSRF protection
- [ ] Request size limits
- [ ] API key rotation for Cloudinary
- [ ] Database connection pooling limits
- [ ] Regular dependency updates

## 📊 Performance Optimizations

### Implemented
- Database connection pooling
- Indexed foreign keys
- Debounced search queries
- Image optimization via Cloudinary
- Next.js Image component for lazy loading

### Future Enhancements
- Redis caching for frequently accessed data
- Database query optimization and indexing
- CDN for static assets
- Service worker for offline support
- Database read replicas






---

**Note**: This application is designed to be scalable from MVP to enterprise. The microservices migration plan provides a clear path forward when horizontal scaling becomes necessary.

