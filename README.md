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

### High-Level Architecture Overview

The platform follows a modern three-tier architecture:

**Frontend (React + Vite)**
- React components with Zustand state management
- Real-time Socket.io client integration
- 3D animations with Three.js
- Responsive design with Tailwind CSS

**Backend (Express.js)**
- RESTful API endpoints
- Authentication & authorization middleware
- Real-time event broadcasting via Socket.io
- Email notification service
- Smart caching layer

**Database (MongoDB)**
- User collection with authentication data
- Complaint collection with status tracking
- Status history for audit trails

---

## 🔄 Workflow Diagrams

### 1. User Authentication Flow

```
1. User visits platform
2. User registers with email/password
3. Server hashes password with bcryptjs
4. MongoDB stores user document
5. JWT token generated
6. Token stored in localStorage
7. Zustand auth store updated
8. User redirected to dashboard

[Login follows similar flow without account creation]
```

### 2. Complaint Submission Workflow

```
1. User opens complaint form modal
2. Fills in title, description, category, priority
3. Submits form with authentication token
4. Express validates input
5. MongoDB creates complaint document
6. Complaint cache invalidated
7. Email confirmation sent (async)
8. Socket.io broadcasts to admin room
9. Admin receives real-time notification
10. User receives success toast
11. Complaint list refreshed
```

### 3. Admin Management Workflow

```
1. Admin views complaints dashboard
2. Fetches all complaints (role-based filtering)
3. Views analytics charts (using Recharts)
4. Clicks complaint to view details
5. Can assign complaint to agent
6. Can update status (pending → in-progress → resolved)
7. Status change triggers:
   - Email sent to original user
   - Socket.io event broadcast
   - Dashboard real-time update
   - Status history recorded
```

### 4. Real-Time Update Flow (Socket.io)

```
1. User A submits complaint
2. Socket.io emits "complaint:created" event
3. Server broadcasts to all connected clients
4. User A receives confirmation
5. User B & Admins receive notification
6. Dashboard updates in real-time
7. No page refresh needed
```

### 5. Email Notification System

```
Event Triggered (e.g., complaint status change)
  ↓
Email Service receives event
  ↓
Selects email template (confirmation/update/status)
  ↓
Composes HTML email body
  ↓
Connects to Mailtrap SMTP
  ↓
Sends email to recipient
  ↓
On error: Logs error and triggers retry logic
```

---

## 📁 Project Structure

```
Smart-Complaint-Service-Platform/
│
├── 📄 README.md                           ← Main documentation
├── 📄 .gitignore
│
├── 📁 client/                             ← React + Vite Frontend
│   ├── 📄 package.json                    ← Dependencies & scripts
│   ├── 📄 vite.config.js                  ← Vite configuration
│   ├── 📄 eslint.config.js                ← Linting rules
│   ├── 📄 index.html                      ← Entry HTML
│   ├── 📄 .env                            ← Environment variables
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx                    ← App entry
│       ├── 📄 App.jsx                     ← Root router
│       ├── 📄 App.css                     ← App styles
│       ├── 📄 index.css                   ← Design system
│       │
│       ├── 📁 components/
│       │   ├── 📁 landing/
│       │   │   ├── HeroCanvas.jsx
│       │   │   ├── HeroSection.jsx
│       │   │   ├── FeaturesSection.jsx
│       │   │   ├── HowItWorksSection.jsx
│       │   │   └── CTASection.jsx
│       │   ├── 📁 dashboard/
│       │   │   ├── Sidebar.jsx
│       │   │   ├── ComplaintCard.jsx
│       │   │   └── SubmitComplaintModal.jsx
│       │   └── 📁 ui/
│       │       └── Navbar.jsx
│       │
│       ├── 📁 pages/
│       │   ├── 📄 LandingPage.jsx
│       │   ├── 📁 auth/
│       │   │   ├── LoginPage.jsx
│       │   │   └── RegisterPage.jsx
│       │   └── 📁 dashboard/
│       │       ├── UserDashboard.jsx
│       │       └── AdminDashboard.jsx
│       │
│       ├── 📁 services/
│       │   └── api.js                     ← Axios client
│       ├── 📁 stores/
│       │   ├── authStore.js               ← Auth state
│       │   └── complaintStore.js          ← Complaints state
│       ├── 📁 hooks/
│       │   └── useSocket.js               ← Socket.io hook
│       ├── 📁 styles/
│       │   └── (design tokens)
│       └── 📁 assets/
│           └── (images, icons)
│
└── 📁 server/                             ← Express.js Backend
    ├── 📄 package.json
    ├── 📄 index.js                        ← Server entry
    ├── 📄 seed.js                         ← Seed script
    ├── 📄 .env
    │
    ├── 📁 config/
    │   └── db.js                          ← MongoDB connection
    ├── 📁 controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   └── userController.js
    ├── 📁 middleware/
    │   ├── auth.js                        ← JWT & role guard
    │   ├── cache.js                       ← Caching
    │   └── errorHandler.js                ← Error handling
    ├── 📁 models/
    │   ├── User.js
    │   └── Complaint.js
    ├── 📁 routes/
    │   ├── auth.js
    │   ├── complaints.js
    │   └── users.js
    └── 📁 services/
        ├── emailService.js
        └── socketService.js
```

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have:
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **MongoDB** running locally or Atlas account
- **Git** installed

### Step 1: Clone the Repository

```bash
git clone https://github.com/COZYkrish/Smart-Complaint-Service-Platform.git
cd Smart-Complaint-Service-Platform
```

### Step 2: Install Frontend Dependencies

```bash
cd client
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd ../server
npm install
```

### Step 4: Verify Installation

```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be v9.0.0 or higher
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/smart-complaint

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
CACHE_TTL=600
```

### Frontend Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### MongoDB Setup

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Windows: Download installer from mongodb.com
# Linux
sudo apt-get install mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to mongodb.com/cloud/atlas
2. Create account → Create cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Mailtrap Setup

1. Go to mailtrap.io
2. Create account & inbox
3. Copy SMTP credentials
4. Add to server `.env`

---

## ▶️ Running the Application

### 1. Start Backend (Terminal 1)

```bash
cd server
npm run dev
# → Running at http://localhost:5000
```

### 2. Seed Database (Terminal 2 - Optional)

```bash
cd server
npm run seed
# Creates admin@smartservice.io / Admin@123456
```

### 3. Start Frontend (Terminal 3)

```bash
cd client
npm run dev
# → Running at http://localhost:5173
```

### 4. Open in Browser

Visit: **http://localhost:5173**

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secure@123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Secure@123"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

---

### Complaint Endpoints

#### Create Complaint
```http
POST /complaints
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Bug in payment",
  "description": "Cannot process payment",
  "category": "technical",
  "priority": "high"
}
```

#### Get All Complaints
```http
GET /complaints?page=1&limit=10&status=pending
Authorization: Bearer {token}
```

#### Get Complaint by ID
```http
GET /complaints/{id}
Authorization: Bearer {token}
```

#### Update Complaint (Admin)
```http
PATCH /complaints/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "in-progress",
  "assignedTo": "userId",
  "priority": "critical"
}
```

#### Delete Complaint
```http
DELETE /complaints/{id}
Authorization: Bearer {token}
```

---

### User Endpoints

#### Get Profile
```http
GET /users/profile
Authorization: Bearer {token}
```

#### Get Statistics
```http
GET /users/statistics
Authorization: Bearer {token}
```

---

## 💾 Database Schema

### User Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user | admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Schema

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String (technical | billing | service | product | other),
  priority: String (low | medium | high | critical),
  status: String (pending | in-progress | resolved | rejected),
  userId: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  statusHistory: [
    {
      status: String,
      changedAt: Date,
      changedBy: ObjectId,
      comment: String
    }
  ],
  resolution: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📡 Real-Time Features (Socket.io)

### Socket Events

**Client → Server:**
```javascript
socket.emit('complaint:create', { title, description });
socket.emit('complaint:subscribe', complaintId);
socket.emit('user:join', { userId });
```

**Server → Client:**
```javascript
socket.emit('complaint:created', complaintData);
socket.emit('complaint:updated', complaintData);
socket.emit('complaint:statusUpdated', updateData);
```

---

## 🔐 Authentication & Security

### Security Features

- ✅ **Password Hashing**: bcryptjs (salt rounds: 10)
- ✅ **JWT Tokens**: 7-day expiration
- ✅ **CORS Protection**: Frontend-only requests allowed
- ✅ **Rate Limiting**: 100 requests per 15 minutes
- ✅ **Security Headers**: Helmet middleware
- ✅ **Input Validation**: All inputs validated
- ✅ **Role-Based Access**: Admin-only endpoints protected

---

## 🚢 Deployment

### Deploy Backend (Heroku)

```bash
# Install Heroku CLI
npm install -g heroku
heroku login

# Create app
cd server
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel
```

### Deploy with Docker

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

---

## 🤝 Contributing

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Commit Message Format

```
<type>(<scope>): <subject>

feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes
refactor: refactor code
```

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
npm run dev       # Start with nodemon
npm run start     # Start normally
npm run seed      # Seed database
npm run test      # Run tests
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# macOS: brew services start mongodb-community
# Windows: Start MongoDB service
# Linux: sudo systemctl start mongodb
```

### CORS Error
- Verify `CLIENT_URL` in `.env` matches frontend URL

### Port Already in Use
```bash
# Kill process using port
lsof -i :5000
kill -9 <PID>
```

### Token Expired
- Clear localStorage: `localStorage.clear()`
- Login again to get new token

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Authors

- **COZYkrish** - Full-stack Development

---

## 📞 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

<div align="center">

### ⭐ If you find this project helpful, please give it a star! ⭐

[⬆ Back to top](#-smart-complaint-service-platform)

</div>
