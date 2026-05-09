# ⬡ SmartService — Smart Complaint & Service Platform

> A portfolio-defining, premium SaaS platform for complaint management. Apple-level design, real-time updates, and production-grade architecture.

![Platform Preview](./preview.png)

---

## ✨ Features

| Feature | Tech |
|---|---|
| 🌌 3D WebGL Hero | React Three Fiber + Three.js |
| 🎞 Cinematic Animations | Framer Motion |
| 🧊 Glassmorphic UI | Custom CSS Design System |
| 🔐 JWT Authentication | bcrypt + jsonwebtoken |
| 📡 Real-Time Updates | Socket.io |
| ⚡ Smart Caching | node-cache |
| 📧 Email Notifications | Nodemailer (Mailtrap) |
| 📊 Admin Analytics | Recharts |
| 🗄 Database | MongoDB + Mongoose |

---

## 🗂 Project Structure

```
Smart-Complaint-Service-Platform/
├── client/                  ← React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/     ← HeroCanvas, HeroSection, Features, HowItWorks, CTA
│   │   │   ├── dashboard/   ← Sidebar, ComplaintCard, SubmitComplaintModal
│   │   │   └── ui/          ← Navbar
│   │   ├── pages/
│   │   │   ├── auth/        ← LoginPage, RegisterPage
│   │   │   ├── dashboard/   ← UserDashboard, AdminDashboard
│   │   │   └── LandingPage.jsx
│   │   ├── stores/          ← Zustand: authStore, complaintStore
│   │   ├── services/        ← Axios API service
│   │   ├── hooks/           ← useSocket
│   │   ├── styles/          ← Design system tokens
│   │   ├── App.jsx          ← Router + guards
│   │   └── index.css        ← Full design system CSS
│   ├── public/
│   ├── .env
│   └── package.json
│
└── server/                  ← Node.js + Express backend
    ├── config/
    │   └── db.js            ← MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   └── userController.js
    ├── middleware/
    │   ├── auth.js          ← JWT + role guards
    │   ├── cache.js         ← node-cache middleware
    │   └── errorHandler.js
    ├── models/
    │   ├── User.js
    │   └── Complaint.js
    ├── routes/
    │   ├── auth.js
    │   ├── complaints.js
    │   └── users.js
    ├── services/
    │   ├── emailService.js  ← Nodemailer templates
    │   └── socketService.js ← Socket.io events
    ├── index.js             ← Server entry
    ├── seed.js              ← Admin seed script
    └── .env
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local: `mongodb://localhost:27017/`)
- npm or yarn

### 1. Clone & Install

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure Environment

**`server/.env`** (already created, update as needed):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-complaint
JWT_SECRET=sc_platform_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_pass
EMAIL_FROM=noreply@smartcomplaint.io
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`client/.env`** (already created):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Admin Account

```bash
cd server
npm run seed
```

This creates: `admin@smartservice.io` / `Admin@123456`

### 4. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → Running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# → Running at http://localhost:5173
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Create account |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/auth/me` | Bearer | Get current user |

### Complaints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/complaints` | User | Create complaint |
| GET | `/api/complaints` | User/Admin | List complaints (filtered) |
| GET | `/api/complaints/:id` | User/Admin | Get single complaint |
| PATCH | `/api/complaints/:id` | Admin | Update status/resolution |
| DELETE | `/api/complaints/:id` | Admin | Delete complaint |
| GET | `/api/complaints/stats` | Admin | Aggregated statistics |

### Users (Admin only)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Admin | Get user |
| PATCH | `/api/users/:id` | Admin | Update role/status |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## 🔌 Real-Time Events (Socket.io)

| Event | Direction | Description |
|---|---|---|
| `complaint_created` | Server → Admin room | New complaint submitted |
| `complaint_updated` | Server → Admin room | Status/data changed |
| `complaint_status_changed` | Server → User room | Status of user's complaint changed |

---

## 🎨 Design System

### Colors
```css
--color-base: #0A0F1C           /* Deep dark background */
--color-primary: #6366f1         /* Indigo */
--color-secondary: #a855f7       /* Purple */
--color-cyan: #06b6d4           /* Accent cyan */
--color-pink: #ec4899           /* Accent pink */
```

### Motion Tokens
```css
--duration-fast: 0.2s
--duration-smooth: 0.4s
--duration-slow: 0.8s
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)
```

---

## 👤 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@smartservice.io` | `Admin@123456` |
| User | Register via `/register` | — |

> ⚠️ Change the admin password after first login!

---

## 🛠 Tech Stack

**Frontend:** React 18 · Vite · Framer Motion · React Three Fiber · Zustand · Axios · Recharts · Socket.io-client · React Hot Toast · Tailwind CSS v4

**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · Socket.io · node-cache · Nodemailer · Helmet · express-rate-limit

---

## 📄 License

MIT © 2024 Smart Complaint & Service Platform
