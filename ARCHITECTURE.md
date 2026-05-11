# 🏗️ Deployment Architecture

This document shows how your application is structured for production deployment.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐            ┌──────▼──────┐
         │ VERCEL      │            │ RENDER      │
         │ (Frontend)  │            │ (Backend)   │
         └──────┬──────┘            └──────┬──────┘
                │                          │
         ┌──────▼──────┐            ┌──────▼──────┐
         │  React App  │            │ Express API │
         │ + Vite      │            │ + Socket.io │
         │             │            │             │
         │ dist/       │            │ server/     │
         └──────┬──────┘            └──────┬──────┘
                │                          │
                │    HTTP/WebSocket       │
                └──────────┬──────────────┘
                           │
                    ┌──────▼──────┐
                    │  MongoDB    │
                    │  Atlas      │
                    │  (Database) │
                    └─────────────┘
```

---

## Deployment Locations

### Frontend (Vercel)
```
📍 Location: Vercel Edge Network (Global CDN)
🌐 Domain: https://your-app.vercel.app
📁 Root Directory: ./client
🔨 Build Command: npm run build
📂 Output Directory: dist/

What's Deployed:
├── HTML (index.html)
├── JavaScript (optimized & minified)
├── CSS (optimized & minified)
├── Assets (images, fonts)
└── Environment Variables (VITE_API_URL, VITE_SOCKET_URL)
```

### Backend (Render)
```
📍 Location: Render's Infrastructure
🌐 Domain: https://your-backend.onrender.com
📁 Root Directory: ./server
🔨 Build Command: cd server && npm install
▶️ Start Command: cd server && npm start

What's Deployed:
├── Node.js Server (Express)
├── Socket.io Server (Real-time)
├── API Routes
├── Database Connection
├── Email Service
└── Environment Variables (all .env variables)
```

### Database (MongoDB Atlas)
```
📍 Location: MongoDB Cloud (Regional Clusters)
🌐 Connection String: mongodb+srv://user:pass@cluster.mongodb.net/db
💾 Storage: Free M0 cluster (512 MB)
🗄️ Collections:
   ├── users
   ├── complaints
   └── (auto-indexed)
```

---

## Data Flow Diagram

### User Registration Flow
```
1. User fills form in Vercel
   │
2. Frontend sends POST to /api/auth/register
   │ (via VITE_API_URL)
   ├─> Render Backend receives request
   │   │
   │   ├─> Validates input
   │   ├─> Hashes password (bcryptjs)
   │   ├─> Saves to MongoDB Atlas
   │   │
   │   └─> Sends verification email (Gmail)
   │
3. Backend returns JWT token to frontend
   │
4. Frontend stores token (localStorage)
   │
5. User receives email from Gmail
```

### Real-Time Complaint Update Flow
```
1. Admin updates complaint status in Vercel
   │
2. Frontend sends PUT to /api/complaints/:id
   │ (via VITE_API_URL)
   ├─> Render Backend receives request
   │   │
   │   ├─> Validates JWT token
   │   ├─> Updates MongoDB Atlas
   │   │
   │   ├─> Emits 'complaint_updated' via Socket.io
   │   │
   │   └─> Sends email notification
   │
3. Socket.io broadcasts to all connected users
   │ (via VITE_SOCKET_URL)
   │
4. User's frontend receives update in real-time
   │
5. Dashboard updates automatically (no page refresh)
```

---

## Environment Variables Flow

### Frontend (Vercel)
```
Vercel Environment Variables
    │
    ├─ VITE_API_URL = https://render-backend.onrender.com/api
    │   └─> Used in src/services/api.js
    │       └─> All API calls go to this URL
    │
    └─ VITE_SOCKET_URL = https://render-backend.onrender.com
        └─> Used in src/hooks/useSocket.js
            └─> Real-time connection established
```

### Backend (Render)
```
Render Environment Variables
    │
    ├─ MONGO_URI = mongodb+srv://...
    │   └─> Connection to MongoDB Atlas
    │
    ├─ CLIENT_URL = https://vercel-app.vercel.app
    │   └─> CORS configuration
    │
    ├─ JWT_SECRET = random-32-char-string
    │   └─> Token signing/verification
    │
    ├─ EMAIL_SERVICE = gmail
    ├─ EMAIL_USER = your-email@gmail.com
    ├─ EMAIL_PASSWORD = app-password
    │   └─> All used by Nodemailer for emails
    │
    └─ NODE_ENV = production
        └─> Error handling & logging
```

---

## Security Flow

```
User Request Flow:
1. Frontend (Vercel) → HTTPS → Render Backend
   ✅ Encrypted transport
   ✅ CORS verified against CLIENT_URL
   ✅ Helmet.js headers applied

2. Backend → HTTPS → MongoDB Atlas
   ✅ Connection string uses credentials
   ✅ IP whitelisted (0.0.0.0/0 in MongoDB)
   ✅ TLS encryption enabled

3. Real-time WebSocket
   ✅ TLS encrypted
   ✅ JWT token required
   ✅ Socket.io CORS verified

4. Email Service (Gmail)
   ✅ App-specific password (not main password)
   ✅ 2FA enabled on Gmail
   ✅ TLS encrypted connection
```

---

## Request/Response Cycle Example

### Complete User Journey: Register → Submit Complaint → Get Update

```
TIME  VERCEL FRONTEND        RENDER BACKEND          MONGODB         GMAIL
│
├──1  Form Submit ────────►  Validate Input
│                            Hash Password
│                            Check Email Exists
│
├──2                         Save User to ──────────►  Insert User
│                            Database                 Document
│
├──3                         Generate JWT
│     ◄──────────────────    Return JWT ◄─────────── Success
│                            + User Data
│
├──4  Store in               
│     localStorage
│
├──5  Send Verification ────►  Email Service
│     Email Request           (Nodemailer)
│
├──6                          Gmail Service ────────►  Send Email
│     
├──7  ◄────────────────────── Return {success:true}
│
├──8  Show Dashboard
│
├──9  User fills Complaint ──►  Validate Input
│     Form                       Attach User ID
│                                File Upload (if any)
│
├──10                        Save Complaint to ─────►  Insert Complaint
│                            Database                 Document
│
├──11                        Socket.io Emit:
│                            'complaint_created'
│                                │
├──12 ◄───────────────────── WebSocket Message ◄──┤
│     (Real-time alert)
│
├──13                        Send Email to Admin
│
└──14 ◄────────────────────── Return Confirmation
     Show Success Alert
```

---

## Deployment Timeline

### First Deployment
```
Day 0 - Setup (30 min)
├─ Create MongoDB Atlas cluster
├─ Generate secrets
└─ Create Render & Vercel accounts

Day 0 - Deployment (15 min)
├─ Deploy Backend on Render
│  └─ Takes ~5 minutes
├─ Deploy Frontend on Vercel
│  └─ Takes ~5 minutes
└─ Configure CORS (2 minutes)

Day 0 - Testing (15 min)
├─ Test registration
├─ Test login
├─ Test complaint submission
├─ Test real-time updates
└─ Test email notifications
```

### Subsequent Deployments
```
Update Code
    │
    ├─> git push origin main
    │
    ├─ Frontend Auto-Deploy
    │  └─ Vercel detects push
    │     └─ Builds & deploys automatically
    │        └─ Takes ~3-5 minutes
    │
    └─ Backend Auto-Deploy
       └─ Render detects push
          └─ Builds & deploys automatically
             └─ Takes ~3-5 minutes
```

---

## Health Checks & Monitoring

```
Continuous Monitoring:

┌─ Vercel
│  ├─ Build status
│  ├─ Page load time
│  ├─ Core Web Vitals
│  └─ Error tracking
│
├─ Render
│  ├─ Service status (green dot = running)
│  ├─ CPU usage
│  ├─ Memory usage
│  ├─ Response times
│  └─ Error logs
│
├─ MongoDB Atlas
│  ├─ Cluster status
│  ├─ Connection count
│  ├─ Database size
│  └─ Query performance
│
└─ External Monitors
   ├─ UptimeRobot
   │  └─ Pings /health endpoint every 5 min
   └─ Sentry/LogRocket
      └─ Captures errors & performance issues
```

---

## Scaling Considerations

### Current Setup (Free Tier)
```
Frontend (Vercel Free):
├─ Unlimited deployments
├─ Unlimited requests
├─ Global CDN
└─ Performance: Excellent

Backend (Render Free):
├─ Single dyno (512 MB RAM)
├─ 750 hours/month runtime
├─ Auto-sleeps after 15 min inactivity
├─ Wake-up time: ~30 seconds
└─ Performance: Good for low traffic

Database (MongoDB Free M0):
├─ 512 MB storage
├─ Shared clusters
├─ Max 100 connections
└─ Performance: Good for 100k+ documents
```

### When to Scale Up

| Metric | Free Tier Limit | When to Upgrade |
|--------|-----------------|-----------------|
| API Requests | Unlimited | When response time > 3s |
| Concurrent Users | ~100 | When > 100 concurrent users |
| Database Storage | 512 MB | When > 400 MB used |
| Data Transfer | Unlimited | When bandwidth > $100/month |
| Response Time | Varies | When consistently > 3s |

### Upgrade Path
```
Vercel
├─ Free → Pro (when need priority support)

Render
├─ Free → Starter ($7/month)
│  └─ Always running (no auto-sleep)
│  └─ 512 MB RAM
├─ Starter → Standard (when > 100k req/day)
│  └─ Auto-scaling
│  └─ 2 GB RAM

MongoDB
├─ M0 → M2 ($9/month)
│  └─ 2 GB storage
│  └─ Dedicated cluster
```

---

## File Structure After Deployment

### What Gets Deployed

**Vercel (Frontend)**:
```
dist/
├── index.html          (entry point)
├── assets/
│   ├── *.js            (optimized chunks)
│   ├── *.css           (optimized styles)
│   └── *               (images, fonts)
└── .nojekyll           (vercel adds this)
```

**Render (Backend)**:
```
server/
├── index.js            (entry point)
├── node_modules/       (dependencies)
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
└── .env                (set via dashboard)
```

---

## Troubleshooting Based on Architecture

If... → Check...

| Problem | Check |
|---------|-------|
| Frontend loads but API fails | VITE_API_URL in Vercel env vars |
| Real-time updates don't work | VITE_SOCKET_URL in Vercel env vars |
| Backend 503 error | Render logs, MONGO_URI correct |
| Email not sending | EMAIL_PASSWORD is app password, not regular password |
| CORS error | CLIENT_URL in Render env vars matches Vercel URL |
| Database connection fails | IP whitelist in MongoDB, connection string correct |
| Slow performance | Check Render CPU/Memory metrics |
| Deployment fails | Check logs in Vercel/Render dashboard |

---

## Summary

- **Frontend** → Deployed globally via Vercel CDN
- **Backend** → Deployed on Render infrastructure  
- **Database** → Hosted on MongoDB Atlas cloud
- **Communication** → HTTPS + WebSocket over HTTPS
- **Environment** → Stored securely in each platform's dashboard
- **Monitoring** → Built-in dashboards + optional external tools

All three components work together to provide a scalable, secure, production-ready application! 🚀

---

**Diagram Version**: 1.0  
**Last Updated**: May 11, 2026
