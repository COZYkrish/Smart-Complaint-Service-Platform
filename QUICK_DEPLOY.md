# 🚀 Quick Start Deployment Guide

## In 5 Minutes - Get Your App Online!

This is a condensed version of the full deployment guide. For complete details, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Prerequisites Setup (10 minutes)

### 1. MongoDB Atlas (Database)
- Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create M0 (free) cluster
- Create database user (username & password)
- Allow access from 0.0.0.0/0
- Copy connection string with credentials

### 2. Gmail App Password (Email Notifications)
- Enable 2FA on Gmail
- Go to [myaccount.google.com/security](https://myaccount.google.com/security) → App passwords
- Generate 16-character password
- Save this password

### 3. JWT Secret
- Generate 32+ character random string at [random.org](https://www.random.org/strings/)
- Save this secret

---

## Deploy Backend (Render) - 3 Steps

### Step 1: Create Web Service
1. Go to [render.com](https://render.com) → Sign in → Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo (authorize Render)
4. Configuration:
   - **Name**: `complaint-service-backend`
   - **Environment**: Node
   - **Build**: `cd server && npm install`
   - **Start**: `cd server && npm start`
   - **Plan**: Free

### Step 2: Add Environment Variables
Click **"Environment"** and add these:

```
NODE_ENV = production
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/complaint-service?retryWrites=true&w=majority
JWT_SECRET = your-32-character-random-string
CLIENT_URL = https://your-app.vercel.app (get this after Vercel setup)
EMAIL_SERVICE = gmail
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-gmail-app-password
EMAIL_FROM = noreply@smartcomplaintservice.com
```

### Step 3: Deploy
- Click **"Create Web Service"**
- Wait ~5 minutes for build
- You'll get URL like: `https://complaint-service-backend.onrender.com`
- **Copy this URL - you'll need it for Vercel**

---

## Deploy Frontend (Vercel) - 3 Steps

### Step 1: Create Project
1. Go to [vercel.com](https://vercel.com) → Sign in → Dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `Smart-Complaint-Service-Platform` repo

### Step 2: Configure
- **Framework**: Vite
- **Root Directory**: `./client`
- **Build Command**: `npm run build`
- **Output**: `dist`

### Step 3: Environment Variables
Before clicking Deploy, add:

```
VITE_API_URL = https://complaint-service-backend.onrender.com/api
VITE_SOCKET_URL = https://complaint-service-backend.onrender.com
```

Then click **"Deploy"**

✅ **Your app is live!** Vercel will show you the URL.

---

## Final Step: Update Backend CORS

1. Go back to Render dashboard
2. Edit `CLIENT_URL` with your Vercel URL (e.g., `https://your-app.vercel.app`)
3. Render will auto-redeploy with new settings

---

## ✅ Test It Works

1. Visit your Vercel URL
2. Try to register → Check your email for verification
3. Log in and submit a complaint
4. Check both user and admin dashboards
5. Verify real-time updates work

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend shows 503 | Wait 1 minute (free tier needs to wake up) |
| CORS error | Update `CLIENT_URL` in Render environment |
| Email not sending | Use Gmail app password, not regular password |
| Real-time not working | Verify `VITE_SOCKET_URL` is correct |

---

## Next Steps

- Set up custom domain
- Enable auto-deploys from GitHub
- Monitor logs regularly
- Update dependencies monthly

---

**That's it! You're deployed! 🎉**

For detailed info, see [DEPLOYMENT.md](./DEPLOYMENT.md)
