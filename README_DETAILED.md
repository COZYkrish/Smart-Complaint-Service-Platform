# 🎯 Smart Complaint Service Platform

> A premium, production-grade SaaS platform for intelligent complaint management with real-time updates, advanced analytics, and enterprise-level security. Built with modern technologies and designed for scalability.

![Smart Complaint Service Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Workflow Diagrams](#workflow-diagrams)
6. [Project Structure](#project-structure)
7. [Installation & Setup](#installation--setup)
8. [Configuration](#configuration)
9. [Running the Application](#running-the-application)
10. [API Documentation](#api-documentation)
11. [Database Schema](#database-schema)
12. [Real-Time Features](#real-time-features)
13. [Authentication & Security](#authentication--security)
14. [Deployment](#deployment)
15. [Contributing](#contributing)

---

## 🎨 Overview

The Smart Complaint Service Platform is a full-stack web application designed to streamline complaint management with intelligent workflows, real-time notifications, and advanced analytics. It provides separate interfaces for end-users and administrators, with features like 3D animations, real-time socket communication, email notifications, and comprehensive caching strategies.

### Core Use Cases:
- **Users** can submit, track, and manage complaints in real-time
- **Admins** can manage, assign, and resolve complaints with analytics dashboard
- **System** automatically sends email notifications for status updates
- **Real-time** socket communication for live updates across all connected clients

---

## ✨ Key Features

| Feature | Description | Technology |
|---------|-------------|-----------|
| 🌌 **3D Interactive Hero** | Stunning 3D WebGL animations on landing page | React Three Fiber + Three.js |
| 🎞 **Cinematic UI** | Smooth, premium animations throughout the app | Framer Motion |
| 🧊 **Glassmorphic Design** | Modern, elegant UI with glassmorphism effects | Custom CSS + Tailwind |
| 🔐 **JWT Authentication** | Secure authentication with role-based access control | bcryptjs + jsonwebtoken |
| 📡 **Real-Time Updates** | Live complaint status updates via WebSockets | Socket.io |
| ⚡ **Smart Caching** | Optimized performance with intelligent caching layer | node-cache |
| 📧 **Email Notifications** | Automated email alerts for complaint updates | Nodemailer + Mailtrap |
| 📊 **Admin Analytics** | Rich data visualization dashboard | Recharts |
| 🗄️ **NoSQL Database** | Flexible, scalable data storage | MongoDB + Mongoose |
| 🛡️ **Security Hardening** | CORS, Helmet, Rate Limiting, CSRF protection | Security best practices |
| 🎯 **Complaint Categories** | Organized complaint management system | Custom categorization |
| 👥 **Role-Based Access** | Separate Admin and User dashboards | Authorization middleware |

---

## 🛠️ Technology Stack

### Frontend
```
React 19                    - UI library
Vite 8                      - Build tool & dev server
React Router 7              - Client-side routing
Zustand 5                   - State management
Axios                       - HTTP client
Socket.io Client 4.8        - Real-time communication
React Three Fiber 9.6       - 3D graphics for React
Three.js 0.184              - 3D WebGL library
Framer Motion 12            - Animation library
Recharts 3.8                - Charts & analytics UI
Tailwind CSS 4              - Utility-first CSS framework
React Hot Toast 2           - Toast notifications
```

### Backend
```
Node.js 18+                 - Runtime
Express 4.22                - Web framework
MongoDB 9.6                 - Database
Mongoose 9.6                - ODM/Schema validation
Socket.io 4.8               - Real-time bidirectional communication
JWT (jsonwebtoken)          - Token-based authentication
bcryptjs 3.0                - Password hashing
Nodemailer 8                - Email service
node-cache 5.1              - In-memory caching
Helmet 8                    - Security headers
CORS 2.8                    - Cross-origin resource sharing
Express Rate Limit          - Request rate limiting
Dotenv                      - Environment variable management
```

### External Services
```
Mailtrap                    - Email testing & sending
MongoDB Atlas               - Cloud database (optional)
JWT Secret Management       - Token signing & verification
```

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer (React + Vite)"]
        LandingPage["Landing Page"]
        AuthPages["Auth Pages<br/>(Login/Register)"]
        UserDash["User Dashboard"]
        AdminDash["Admin Dashboard"]
        UI["UI Components<br/>(Navbar, Sidebar, Modal)"]
    end

    subgraph Store["🏪 State Management (Zustand)"]
        AuthStore["Auth Store<br/>(user, token, role)"]
        ComplaintStore["Complaint Store<br/>(complaints, filters)"]
    end

    subgraph API["🌐 API Layer (Axios)"]
        AuthAPI["Auth API"]
        ComplaintAPI["Complaint API"]
        UserAPI["User API"]
    end

    subgraph RealTime["📡 Real-Time Layer (Socket.io)"]
        SocketClient["Socket Client"]
        Events["Events<br/>(complaint.created,<br/>complaint.updated)"]
    end

    subgraph Backend["🔧 Backend Layer (Express)"]
        AuthController["Auth Controller<br/>(login, register, logout)"]
        ComplaintController["Complaint Controller<br/>(CRUD operations)"]
        UserController["User Controller<br/>(profile, stats)"]
        Routes["Routes & Middleware<br/>(auth, validation, cache)"]
    end

    subgraph Services["⚙️ Services"]
        EmailService["📧 Email Service<br/>(Nodemailer)"]
        SocketService["📡 Socket Service<br/>(real-time events)"]
        CacheService["⚡ Cache Service<br/>(node-cache)"]
    end

    subgraph Database["🗄️ Data Layer (MongoDB)"]
        UsersCollection["Users Collection"]
        ComplaintsCollection["Complaints Collection"]
        Sessions["Session Management"]
    end

    Client -->|API Calls| API
    Client -->|WebSocket| RealTime
    API --> Backend
    RealTime --> SocketService
    AuthPages --> AuthStore
    UserDash --> ComplaintStore
    AdminDash --> ComplaintStore
    Backend --> Services
    Services --> Database
    AuthController --> EmailService
    ComplaintController --> EmailService
    ComplaintController --> SocketService
    EmailService -->|SMTP| Mailtrap["📬 Mailtrap<br/>(Email Service)"]

    style Client fill:#e1f5ff
    style Backend fill:#fff3e0
    style Database fill:#f3e5f5
    style Services fill:#e8f5e9
    style Store fill:#fce4ec
    style RealTime fill:#fff9c4
```

---

## 🔄 Workflow Diagrams

### 1. User Authentication Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Browser as 🌐 Browser/Client
    participant API as 📡 Express API
    participant DB as 🗄️ MongoDB
    participant JWT as 🔐 JWT Manager

    User->>Browser: Enter credentials
    Browser->>API: POST /api/auth/register
    API->>DB: Check if user exists
    alt User Exists
        API-->>Browser: Error 400
        Browser-->>User: "User already registered"
    else New User
        API->>API: Hash password with bcryptjs
        API->>DB: Create new user
        API->>JWT: Generate JWT token
        JWT-->>API: Return token
        API-->>Browser: Success + token + user data
        Browser->>Browser: Store token in localStorage
        Browser->>Browser: Update auth store
        Browser-->>User: Redirect to dashboard
    end
```

### 2. Complaint Submission Workflow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant UI as 🎨 UI (Modal)
    participant Store as 🏪 Zustand Store
    participant API as 📡 Express API
    participant DB as 🗄️ MongoDB
    participant Cache as ⚡ Cache
    participant Email as 📧 Email Service
    participant Socket as 📡 Socket.io
    participant Admin as 👨‍💼 Admin

    User->>UI: Fill complaint form
    User->>UI: Click "Submit"
    UI->>Store: Dispatch complaint data
    Store->>API: POST /api/complaints<br/>(with JWT token)
    API->>API: Validate input
    API->>DB: Create complaint document
    DB-->>API: Return complaint object
    API->>Cache: Invalidate complaints cache
    API->>Email: Send confirmation email (async)
    Email-->>User: Confirmation email
    API->>Socket: Emit complaint.created event
    Socket->>Admin: Broadcast to admin room
    Admin->>UI: Receive real-time update
    API-->>UI: Success response
    UI->>Store: Update complaints list
    UI-->>User: Show success toast
    UI->>UI: Close modal & refresh
```

### 3. Admin Complaint Management Workflow

```mermaid
sequenceDiagram
    participant Admin as 👨‍💼 Admin
    participant Dashboard as 📊 Admin Dashboard
    participant Store as 🏪 Complaint Store
    participant API as 📡 Express API
    participant DB as 🗄️ MongoDB
    participant Email as 📧 Email Service
    participant Socket as 📡 Socket.io
    participant User as 👤 Original User

    Admin->>Dashboard: View complaints list
    Dashboard->>API: GET /api/complaints
    API->>DB: Query all complaints
    DB-->>API: Return complaints array
    API-->>Dashboard: Return paginated results
    Dashboard->>Store: Update complaints

    Admin->>Dashboard: Click complaint
    Dashboard->>API: GET /api/complaints/:id
    API->>DB: Fetch complaint details
    DB-->>API: Return full complaint

    Admin->>Dashboard: Assign to agent
    Dashboard->>API: PATCH /api/complaints/:id<br/>(assignedTo: agentId)
    API->>DB: Update complaint
    API->>Socket: Emit complaint.updated
    Socket->>User: Real-time notification
    API->>Email: Send assignment email

    Admin->>Dashboard: Update status
    Dashboard->>API: PATCH /api/complaints/:id<br/>(status: resolved)
    API->>DB: Update status + add to history
    API->>Email: Send status update email
    Email-->>User: "Your complaint status changed"
    API->>Socket: Emit complaint.updated
    Socket-->>Dashboard: Refresh complaint card
```

### 4. Real-Time Update Flow (Socket.io)

```mermaid
sequenceDiagram
    participant Client1 as 👤 User A
    participant Client2 as 👤 User B
    participant SocketServer as 📡 Socket Server
    participant DB as 🗄️ Database
    participant Cache as ⚡ Cache

    Note over Client1,SocketServer: User A submits complaint
    Client1->>SocketServer: Emit complaint.create
    SocketServer->>DB: Save complaint
    DB-->>SocketServer: Complaint saved
    SocketServer->>Cache: Invalidate cache

    Note over SocketServer,Client2: Server broadcasts to all
    SocketServer->>Client1: Emit complaint.created (confirmation)
    SocketServer->>Client2: Emit complaint.created (notify)
    SocketServer->>SocketServer: (Admin rooms notified separately)

    Client1-->>User: "Complaint submitted!"
    Client2-->>User: "New complaint received"
```

### 5. Email Notification System

```mermaid
graph LR
    A["📧 Event Triggered<br/>(complaint.created)"] --> B["📨 Email Service"]
    B --> C["📝 Template Selection<br/>(confirmation/update)"]
    C --> D["📬 Compose Email<br/>(HTML body)"]
    D --> E["🔗 Mailtrap SMTP<br/>(smtp.mailtrap.io)"]
    E --> F["✉️ Recipient Email"]
    B --> G["❌ Error Handler<br/>(log & notify)"]
    G --> H["🔄 Retry Logic"]

    style A fill:#fff3cd
    style B fill:#d1ecf1
    style F fill:#d4edda
    style G fill:#f8d7da
```

### 6. Complete User Journey

```mermaid
graph TB
    Start(["🚀 User Visits Site"]) --> Landing["🎨 Landing Page<br/>(3D Hero + Features)"]
    Landing --> Decision{"Already<br/>Registered?"}
    
    Decision -->|No| Register["📝 Register Page"]
    Register --> CreateAccount["Create Account<br/>+ Set Password"]
    CreateAccount --> Email1["✉️ Confirmation Email"]
    Email1 --> Login["🔐 Login Page"]
    
    Decision -->|Yes| Login
    Login --> Auth["Authenticate<br/>(JWT Token)"]
    Auth --> Redirect["➡️ Redirect to Dashboard"]
    Redirect --> UserDash["👤 User Dashboard"]
    
    UserDash --> ViewComplaints["📋 View My Complaints"]
    UserDash --> SubmitNew["➕ Submit New Complaint"]
    
    SubmitNew --> Modal["🎯 Complaint Modal"]
    Modal --> Form["Fill Form<br/>(title, desc, category)"]
    Form --> Submit["🔘 Submit"]
    Submit --> Success["✅ Success Toast"]
    Success --> Confirmation["✉️ Confirmation Email"]
    Success --> Dashboard["📊 Updated Dashboard"]
    
    ViewComplaints --> Details["View Complaint<br/>Details & History"]
    Details --> Track["📍 Track Status"]
    Track --> UpdateNoti["🔔 Real-time Updates<br/>(via Socket.io)"]
    UpdateNoti --> Dashboard
    
    Dashboard --> RealTime["📡 Real-time Status<br/>Changes"]
    RealTime --> Email2["✉️ Status Email"]
    Email2 --> Notify["🔔 Toast Notification"]
    
    style Start fill:#e3f2fd
    style Landing fill:#f3e5f5
    style Login fill:#fff3e0
    style UserDash fill:#e8f5e9
    style SubmitNew fill:#fce4ec
    style Success fill:#d4edda
    style RealTime fill:#fff9c4

    click UserDash "dashboard" _blank
```

### 7. Admin Dashboard Workflow

```mermaid
graph TB
    A["👨‍💼 Admin Login"] --> B["📊 Admin Dashboard"]
    
    B --> C["📈 Analytics Section"]
    C --> C1["Total Complaints<br/>Chart"]
    C --> C2["Status Distribution<br/>Pie Chart"]
    C --> C3["Priority Breakdown<br/>Bar Chart"]
    
    B --> D["📋 Complaints List"]
    D --> D1["Filter by Status"]
    D --> D2["Filter by Priority"]
    D --> D3["Filter by Category"]
    D --> D4["Search & Paginate"]
    
    B --> E["✏️ Manage Complaint"]
    E --> E1["View Details"]
    E1 --> E2["Assign to Agent"]
    E2 --> E3["Change Status"]
    E3 --> E4["Send Email Update"]
    E4 --> E5["✉️ User Notification"]
    
    B --> F["👥 User Management"]
    F --> F1["View User Profiles"]
    F --> F2["View User History"]
    
    B --> G["⚙️ System Settings"]
    G --> G1["Email Templates"]
    G --> G2["Notification Rules"]
    
    E5 --> H["📡 Real-time Socket<br/>Broadcast"]
    H --> I["🔔 Live Dashboard<br/>Update"]
    
    style A fill:#fff3e0
    style B fill:#e8f5e9
    style C fill:#f3e5f5
    style D fill:#e1f5fe
    style E fill:#fce4ec
    style E5 fill:#c8e6c9
    style H fill:#fff9c4
```

---

## 📁 Project Structure

```
Smart-Complaint-Service-Platform/
│
├── 📄 README.md                           ← Original README
├── 📄 README_DETAILED.md                  ← This file
├── 📄 .gitignore
│
├── 📁 client/                             ← React + Vite Frontend
│   ├── 📄 package.json                    ← Dependencies & scripts
│   ├── 📄 vite.config.js                  ← Vite configuration
│   ├── 📄 eslint.config.js                ← Linting rules
│   ├── 📄 index.html                      ← Entry HTML file
│   ├── 📄 .env                            ← Environment variables
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx                    ← App entry point
│       ├── 📄 App.jsx                     ← Root router component
│       ├── 📄 App.css                     ← Global app styles
│       ├── 📄 index.css                   ← Design system CSS
│       │
│       ├── 📁 components/
│       │   ├── 📁 landing/                ← Landing page components
│       │   │   ├── HeroCanvas.jsx         ← 3D WebGL canvas
│       │   │   ├── HeroSection.jsx        ← Hero text section
│       │   │   ├── FeaturesSection.jsx    ← Features showcase
│       │   │   ├── HowItWorksSection.jsx  ← Process explanation
│       │   │   └── CTASection.jsx         ← Call-to-action
│       │   │
│       │   ├── 📁 dashboard/              ← Dashboard components
│       │   │   ├── Sidebar.jsx            ← Navigation sidebar
│       │   │   ├── ComplaintCard.jsx      ← Complaint display card
│       │   │   └── SubmitComplaintModal.jsx ← Modal form
│       │   │
│       │   └── 📁 ui/                     ← Reusable UI components
│       │       └── Navbar.jsx             ← Top navigation bar
│       │
│       ├── 📁 pages/
│       │   ├── 📄 LandingPage.jsx         ← Landing page
│       │   ├── 📁 auth/
│       │   │   ├── LoginPage.jsx          ← Login form
│       │   │   └── RegisterPage.jsx       ← Registration form
│       │   └── 📁 dashboard/
│       │       ├── UserDashboard.jsx      ← User complaints view
│       │       └── AdminDashboard.jsx     ← Admin management view
│       │
│       ├── 📁 services/
│       │   └── api.js                     ← Axios API client
│       │
│       ├── 📁 stores/
│       │   ├── authStore.js               ← Auth state (Zustand)
│       │   └── complaintStore.js          ← Complaints state (Zustand)
│       │
│       ├── 📁 hooks/
│       │   └── useSocket.js               ← Socket.io custom hook
│       │
│       ├── 📁 styles/                     ← Design tokens
│       │   └── (design system files)
│       │
│       └── 📁 assets/
│           └── (images, icons, etc.)
│
├── 📁 server/                             ← Express.js Backend
│   ├── 📄 package.json                    ← Dependencies & scripts
│   ├── 📄 index.js                        ← Server entry point
│   ├── 📄 seed.js                         ← Database seeding script
│   ├── 📄 .env                            ← Environment variables
│   │
│   ├── 📁 config/
│   │   └── db.js                          ← MongoDB connection
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js              ← Auth logic (register, login)
│   │   ├── complaintController.js         ← Complaint CRUD operations
│   │   └── userController.js              ← User profile operations
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                        ← JWT verification & role guard
│   │   ├── cache.js                       ← Caching middleware
│   │   └── errorHandler.js                ← Error handling
│   │
│   ├── 📁 models/
│   │   ├── User.js                        ← User schema (Mongoose)
│   │   └── Complaint.js                   ← Complaint schema (Mongoose)
│   │
│   ├── 📁 routes/
│   │   ├── auth.js                        ← Auth endpoints
│   │   ├── complaints.js                  ← Complaint endpoints
│   │   └── users.js                       ← User endpoints
│   │
│   └── 📁 services/
│       ├── emailService.js                ← Nodemailer + templates
│       └── socketService.js               ← Socket.io setup & events
│
└── 📄 .gitignore                          ← Git ignore rules
```

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have:
- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **MongoDB** running locally or MongoDB Atlas account
- **Git** installed on your system

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/Smart-Complaint-Service-Platform.git
cd Smart-Complaint-Service-Platform
```

### Step 2: Install Frontend Dependencies

```bash
cd client
npm install
```

Expected installation time: 2-3 minutes

### Step 3: Install Backend Dependencies

```bash
cd ../server
npm install
```

Expected installation time: 1-2 minutes

### Step 4: Verify Installation

```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be v9.0.0 or higher
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
touch .env
```

Add the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/smart-complaint
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-complaint

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Service (Mailtrap)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@smartcomplaint.io

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Cache Settings
CACHE_TTL=600  # 10 minutes in seconds
```

### Frontend Environment Variables

Create a `.env` file in the `client/` directory:

```bash
cd ../client
touch .env
```

Add the following configuration:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Setting Up Mailtrap

1. Go to [Mailtrap.io](https://mailtrap.io)
2. Create a free account
3. Create an inbox
4. Copy SMTP credentials to your `.env` file
5. Use the Mailtrap interface to view sent emails

### Setting Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Windows: Download installer from mongodb.com
# Linux: sudo apt-get install mongodb

# Start MongoDB service
mongod

# Verify connection
mongo mongodb://localhost:27017/
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Replace `MONGO_URI` in `.env`

---

## ▶️ Running the Application

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
Connected to MongoDB: smart-complaint
```

### 2. Seed Initial Data (Optional but Recommended)

In a new terminal:
```bash
cd server
npm run seed
```

This creates:
- **Admin Account**: `admin@smartservice.io` / `Admin@123456`
- **Sample Data**: 5 demo complaints for testing

### 3. Start the Frontend Dev Server

In another terminal:
```bash
cd client
npm run dev
```

Expected output:
```
VITE v8.0.0  ready in 256 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### 4. Open in Browser

Visit: http://localhost:5173

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Authentication

Include JWT token in headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### Auth Endpoints

#### 1. Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secure@123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 2. Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Secure@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 3. Logout User

```http
POST /auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Complaint Endpoints

#### 4. Create Complaint

```http
POST /complaints
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Bug in payment system",
  "description": "Cannot process payment with card ending in 1234",
  "category": "technical",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "complaint": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Bug in payment system",
      "description": "Cannot process payment with card ending in 1234",
      "category": "technical",
      "priority": "high",
      "status": "pending",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "statusHistory": [
        {
          "status": "pending",
          "changedAt": "2024-01-15T10:30:00Z",
          "changedBy": "507f1f77bcf86cd799439011"
        }
      ]
    }
  }
}
```

---

#### 5. Get All Complaints

```http
GET /complaints?page=1&limit=10&status=pending&priority=high
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (default: 1) - Page number for pagination
- `limit` (default: 10) - Items per page
- `status` - Filter by status (pending, in-progress, resolved, rejected)
- `priority` - Filter by priority (low, medium, high, critical)
- `category` - Filter by category

**Response (200):**
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Bug in payment system",
        "description": "Cannot process payment",
        "category": "technical",
        "priority": "high",
        "status": "pending",
        "userId": { "name": "John Doe", "email": "john@example.com" },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10
    }
  }
}
```

---

#### 6. Get Complaint by ID

```http
GET /complaints/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "complaint": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Bug in payment system",
      "description": "Cannot process payment",
      "category": "technical",
      "priority": "high",
      "status": "pending",
      "userId": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
      "assignedTo": { "_id": "...", "name": "Agent Smith", "email": "smith@company.com" },
      "statusHistory": [
        {
          "status": "pending",
          "changedAt": "2024-01-15T10:30:00Z",
          "changedBy": "507f1f77bcf86cd799439011"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

---

#### 7. Update Complaint (Admin Only)

```http
PATCH /complaints/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in-progress",
  "assignedTo": "507f1f77bcf86cd799439099",
  "priority": "critical"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint updated successfully",
  "data": {
    "complaint": {
      "_id": "507f1f77bcf86cd799439012",
      "status": "in-progress",
      "assignedTo": { "_id": "507f1f77bcf86cd799439099", "name": "Agent Smith" },
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

---

#### 8. Delete Complaint

```http
DELETE /complaints/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Complaint deleted successfully"
}
```

---

### User Endpoints

#### 9. Get User Profile

```http
GET /users/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-10T08:00:00Z"
    }
  }
}
```

---

#### 10. Get User Statistics

```http
GET /users/statistics
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalComplaints": 12,
      "pendingComplaints": 3,
      "resolvedComplaints": 9,
      "rejectedComplaints": 0,
      "averageResolutionTime": "2.5 days"
    }
  }
}
```

---

## 💾 Database Schema

### User Schema

```javascript
// models/User.js
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Complaint Schema

```javascript
// models/Complaint.js
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'service', 'product', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  statusHistory: [
    {
      status: String,
      changedAt: {
        type: Date,
        default: Date.now
      },
      changedBy: {
        type: ObjectId,
        ref: 'User'
      },
      comment: String
    }
  ],
  resolution: {
    type: String,
    default: null
  },
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 📡 Real-Time Features (Socket.io)

### Socket Events

#### Client → Server Events

```javascript
// Connect
socket.on('connect', () => {
  // User connected
  // Admin joins 'admin' room
  // User joins personal room
});

// Complaint Events
socket.emit('complaint:create', {
  title: 'Bug report',
  description: 'App crashes on login'
});

socket.emit('complaint:subscribe', complaintId);
socket.emit('complaint:unsubscribe', complaintId);
```

#### Server → Client Events

```javascript
// Broadcast to all users
socket.emit('complaint:created', {
  _id: '507f1f77bcf86cd799439012',
  title: 'New complaint received',
  userId: { name: 'John', email: 'john@example.com' },
  createdAt: Date.now()
});

// Broadcast to admin room
io.to('admin').emit('complaint:assigned', {
  complaintId: '507f1f77bcf86cd799439012',
  assignedTo: 'Agent Smith'
});

// Broadcast to admin room
io.to('admin').emit('complaint:statusUpdated', {
  complaintId: '507f1f77bcf86cd799439012',
  oldStatus: 'pending',
  newStatus: 'in-progress',
  updatedAt: Date.now()
});

// Send to specific user
socket.to(userId).emit('complaint:updated', {
  complaintId: '507f1f77bcf86cd799439012',
  status: 'resolved',
  message: 'Your complaint has been resolved!'
});
```

### Using Socket.io in Components

```javascript
// hooks/useSocket.js
import { useEffect } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId) => {
  useEffect(() => {
    const socket = io(process.env.VITE_SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to server');
      // Join personal room
      socket.emit('user:join', { userId });
    });

    socket.on('complaint:created', (complaint) => {
      console.log('New complaint:', complaint);
      // Update UI
    });

    socket.on('complaint:statusUpdated', (data) => {
      console.log('Complaint updated:', data);
      // Refresh complaint details
    });

    return () => socket.disconnect();
  }, [userId]);
};
```

---

## 🔐 Authentication & Security

### Security Features

1. **Password Hashing**
   - Passwords hashed with bcryptjs (salt rounds: 10)
   - Passwords never stored in plain text
   - Never returned in API responses

2. **JWT Authentication**
   - Tokens issued on login/register
   - Expires in 7 days
   - Verified on protected routes
   - Refresh token strategy (optional implementation)

3. **CORS Protection**
   - Only allow requests from frontend URL
   - Credentials enabled for cross-domain requests

4. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents brute force attacks

5. **Helmet Security Headers**
   - Cross-Origin Embedder Policy
   - X-Content-Type-Options
   - X-Frame-Options
   - Strict-Transport-Security

6. **Input Validation**
   - All inputs validated before processing
   - MongoDB injection prevention
   - XSS prevention via sanitization

### Role-Based Access Control (RBAC)

```javascript
// middleware/auth.js

// Protect route - requires authentication
const protectRoute = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
};

// Admin only route
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Usage in routes
router.patch('/complaints/:id', protectRoute, adminOnly, updateComplaint);
```

---

## 🚢 Deployment

### Deploy Backend (Heroku)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd server
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLIENT_URL=your_frontend_url
   # ... other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Deploy Frontend (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel
   ```

3. **Configure Environment**
   - Set `VITE_API_URL` to your deployed backend URL
   - Set `VITE_SOCKET_URL` to your deployed backend URL

### Deploy with Docker

**Dockerfile (Backend)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

**Dockerfile (Frontend)**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🤝 Contributing

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/Smart-Complaint-Service-Platform.git
   cd Smart-Complaint-Service-Platform
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow the existing code style
   - Write meaningful commit messages
   - Test your changes locally

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Describe what your PR does
   - Link any related issues
   - Wait for review

### Code Style Guidelines

- **JavaScript**: Use ES6+ syntax
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Formatting**: Use Prettier (already configured)
- **Comments**: Add comments for complex logic
- **Git Messages**: Follow conventional commits

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

**Examples**:
- `feat(auth): add password reset functionality`
- `fix(complaints): resolve socket event timing issue`
- `docs: update API documentation`

---

## 📦 Available Scripts

### Client

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Server

```bash
npm run dev       # Start with nodemon (auto-restart)
npm run start     # Start normally
npm run seed      # Seed database with initial data
npm run test      # Run tests (if configured)
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows
net start MongoDB
```

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/...' from origin 'http://localhost:5173' has been blocked
```
**Solution**: Verify `CLIENT_URL` in backend `.env` matches frontend URL

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change port in `.env` or kill the process using the port
```bash
# Find process
lsof -i :5000

# Kill process (macOS/Linux)
kill -9 <PID>
```

### Token Expired Error
```
Error: jwt expired
```
**Solution**: Clear localStorage and login again
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## 📚 Resources & Documentation

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Three.js Documentation](https://threejs.org/docs/)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Your Name** - Full-stack Development
- **Contributors** - Welcome!

---

## 📞 Support

- **Documentation**: Check this README
- **Issues**: Open an issue on GitHub
- **Email**: your-email@example.com
- **Discord**: [Join our community](https://discord.gg/...)

---

## 🙏 Acknowledgments

- Thanks to the open-source community
- Inspired by modern SaaS platforms
- Built with ❤️

---

**Last Updated**: January 2025

<div align="center">

### ⭐ If you find this project helpful, please give it a star! ⭐

[⬆ Back to top](#-smart-complaint-service-platform)

</div>
