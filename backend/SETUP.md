# Backend Setup Guide

## Overview
Express.js backend with PostgreSQL for employee performance management system.

## Architecture

```
backend/src/
├── config/
│   └── db.js              # PostgreSQL connection pool
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── employeeController.js  # Employee CRUD operations
├── middleware/
│   └── authMiddleware.js  # JWT verification middleware
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── employeeRoutes.js  # Employee endpoints
├── utils/
│   └── jwt.js             # Token generation and verification
├── app.js                 # Express app configuration
└── server.js              # Server startup
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create or update `.env` file:
```env
PORT=5000
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_NAME=performance_db
POSTGRES_USER=postgres
POSTGRES_PASS=postgres
JWT_SECRET=your-secret-key-change-this-in-production
```

### 3. Setup PostgreSQL Database

#### For Local Development:
```bash
# Create database
createdb performance_db

# Apply schema
psql -U postgres -d performance_db -f schema.sql
```

#### For Docker:
```bash
docker run --name postgres-perf \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=performance_db \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Run the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (requires auth)

### Employees (all require authentication)
- **GET** `/api/employees` - Get all employees
- **GET** `/api/employees/:id` - Get employee by ID
- **POST** `/api/employees` - Create new employee
- **PUT** `/api/employees/:id` - Update employee
- **DELETE** `/api/employees/:id` - Delete employee

## Sample API Calls

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "manager"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user_id": 1,
    "designation": "Senior Developer",
    "department": "Engineering",
    "manager_id": null,
    "joining_date": "2024-01-15"
  }'
```

## Database Schema

### Users Table
- id (serial primary key)
- name (varchar)
- email (varchar unique)
- password_hash (varchar)
- role (varchar default: employee)
- created_at (timestamp)

### Employees Table
- id (serial primary key)
- user_id (fk: users)
- designation (varchar)
- department (varchar)
- manager_id (fk: employees)
- joining_date (date)
- created_at, updated_at (timestamps)

### Reviews Table
- id (serial primary key)
- employee_id (fk: employees)
- reviewer_id (fk: employees)
- rating (integer 1-5)
- feedback (text)
- review_period (varchar)
- created_at (timestamp)

## Development Notes

- Connection pooling is implemented for better performance
- JWT tokens expire after 24 hours by default
- Passwords are hashed using bcryptjs (10 salt rounds)
- Error handling middleware catches and formats all errors
- All protected endpoints require a valid JWT token in Authorization header

## Next Steps

1. Create Reviews CRUD endpoints
2. Add input validation using joi or express-validator
3. Implement role-based access control
4. Add filtering and pagination to list endpoints
5. Write unit and integration tests
