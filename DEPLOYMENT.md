# 🚀 Deployment Guide: Vercel & Render

This guide provides detailed steps to deploy your Smart Complaint Service Platform to production using **Vercel** (frontend) and **Render** (backend).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup (Render)](#backend-setup-render)
3. [Frontend Setup (Vercel)](#frontend-setup-vercel)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Troubleshooting](#troubleshooting)
6. [Environment Variables Reference](#environment-variables-reference)

---

## Prerequisites

Before starting, ensure you have:

- ✅ GitHub account with your repository pushed
- ✅ MongoDB Atlas account (free tier available)
- ✅ Render account (render.com)
- ✅ Vercel account (vercel.com)
- ✅ Gmail account with App Password (for email notifications)
- ✅ All sensitive credentials ready

### Create MongoDB Atlas Cluster (FREE)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project and cluster (M0 Free tier)
4. In the Security section, create a database user:
   - Username: `complaintsvc`
   - Password: Generate a strong password and save it
5. Click "Network Access" → "Add IP Address" → Allow from Anywhere (0.0.0.0/0)
6. Get your connection string:
   - Go to Clusters → Connect
   - Choose "Drivers" and copy the MongoDB URI
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://complaintsvc:PASSWORD@cluster.mongodb.net/complaint-service?retryWrites=true&w=majority`

### Generate Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Scroll to "App passwords"
4. Select Mail and Windows PC (or your OS)
5. Google will generate a 16-character password
6. Copy this password (you'll need it for EMAIL_PASSWORD)

---

## Backend Setup (Render)

### Step 1: Push Code to GitHub

Ensure your entire project is pushed to GitHub:

```bash
git add .
git commit -m "Deploy: Prepare for production"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"**
   - Authorize Render with GitHub
   - Select your `Smart-Complaint-Service-Platform` repository
4. Fill in the configuration:
   - **Name**: `complaint-service-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     cd server && npm install
     ```
   - **Start Command**: 
     ```
     cd server && npm start
     ```
   - **Plan**: Free or Starter (depending on your needs)

### Step 3: Add Environment Variables

In the Render dashboard for your service:

1. Scroll to **"Environment"** section
2. Add each variable as a separate entry:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `MONGO_URI` | Your MongoDB Atlas connection string | `mongodb+srv://complaintsvc:PASSWORD@cluster.mongodb.net/complaint-service?retryWrites=true&w=majority` |
| `JWT_SECRET` | A long random string (32+ characters) | Generate at [generate-random.org](https://www.random.org/strings/) |
| `CLIENT_URL` | Your Vercel frontend URL | `https://your-app.vercel.app` |
| `EMAIL_SERVICE` | `gmail` | `gmail` |
| `EMAIL_USER` | Your Gmail address | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Your Gmail App Password | (16-character password from Gmail) |
| `EMAIL_FROM` | Display email | `noreply@complaintsvc.com` |
| `SOCKET_URL` | Your Render backend URL | Will be auto-generated, e.g., `https://complaint-service-backend.onrender.com` |

**Important**: After deploying, Render will provide you with a URL like `https://complaint-service-backend.onrender.com`. Update `CLIENT_URL` in your Vercel environment variables with this URL.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy from your GitHub repository
3. Wait for the build to complete (you'll see logs in the dashboard)
4. Once deployed, you'll see a green "Live" status
5. Copy your service URL (e.g., `https://complaint-service-backend.onrender.com`)

### Step 5: Test Backend

```bash
# Test if backend is running
curl https://complaint-service-backend.onrender.com/api/health

# Or visit in browser
https://complaint-service-backend.onrender.com/api/health
```

---

## Frontend Setup (Vercel)

### Step 1: Ensure Frontend is Ready

Update your `client/package.json` with build script if not present:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to GitHub repository
   - Select scope (personal account)
   - Confirm directory: `client/`
   - Accept default settings

#### Option B: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your `Smart-Complaint-Service-Platform` repository
5. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Environment Variables"** and add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://complaint-service-backend.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://complaint-service-backend.onrender.com` |

7. Click **"Deploy"**

### Step 3: Verify Frontend Deployment

1. Wait for deployment to complete
2. Vercel will provide a URL like: `https://complaint-service-1a2b3c.vercel.app`
3. Visit the URL in your browser
4. You should see your landing page

### Step 4: Update Backend CORS (if needed)

Go back to Render dashboard and update the `CLIENT_URL` environment variable with your Vercel URL:

```
CLIENT_URL=https://complaint-service-1a2b3c.vercel.app
```

Then redeploy the backend.

---

## Post-Deployment Verification

### ✅ Checklist

- [ ] Backend is deployed and running on Render
- [ ] Frontend is deployed and running on Vercel
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] MongoDB connection is working
- [ ] Email notifications are sending
- [ ] Socket.io connection is established
- [ ] User authentication works (register/login)
- [ ] Complaint submission works
- [ ] Real-time updates are visible

### Testing Each Feature

#### 1. Test Authentication
```bash
# Go to your frontend URL and try:
# 1. Register a new account
# 2. Receive confirmation email
# 3. Log in with credentials
```

#### 2. Test API Connectivity
```bash
# From browser console on your frontend:
fetch('https://complaint-service-backend.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test123!',
    role: 'user'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

#### 3. Test Socket.io Connection
```bash
# From browser console:
# You should see a green indicator if Socket.io is connected
```

---

## Troubleshooting

### Issue: Backend returns 503 Service Unavailable

**Solution:**
1. Check Render dashboard for errors
2. Verify all environment variables are set
3. Check MongoDB connection string is correct
4. Render free tier might be sleeping - it wakes up on first request

### Issue: Frontend shows CORS errors

**Solution:**
1. Verify `CLIENT_URL` is set correctly in Render
2. Check VITE_API_URL is correct in Vercel
3. Ensure backend's CORS middleware includes Vercel URL:
   ```javascript
   // In server/index.js
   origin: process.env.CLIENT_URL || 'http://localhost:5173',
   ```

### Issue: Email notifications not sending

**Solution:**
1. Verify EMAIL_USER and EMAIL_PASSWORD are correct
2. Ensure Gmail App Password is used (not regular password)
3. Check email service logs in Render dashboard
4. Verify EMAIL_SERVICE is set to `gmail`

### Issue: Real-time updates not working (Socket.io)

**Solution:**
1. Verify VITE_SOCKET_URL matches your Render backend URL
2. Check browser console for WebSocket errors
3. Ensure Socket.io is properly initialized in frontend:
   ```javascript
   // In client/src/hooks/useSocket.js
   // Should use VITE_SOCKET_URL environment variable
   ```

### Issue: 502 Bad Gateway on Render

**Solution:**
1. Your backend crashed - check Render logs
2. Verify start command is correct
3. Check for syntax errors in code
4. Ensure all dependencies are in package.json

---

## Environment Variables Reference

### Backend (.env) - Render

```env
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/complaint-service?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
CLIENT_URL=https://your-vercel-app.vercel.app

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-key-minimum-32-characters

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@smartcomplaintservice.com

# Socket.io
SOCKET_URL=https://complaint-service-backend.onrender.com
```

### Frontend (.env) - Vercel

```env
VITE_API_URL=https://complaint-service-backend.onrender.com/api
VITE_SOCKET_URL=https://complaint-service-backend.onrender.com
```

---

## Security Best Practices

1. **Never commit `.env` files** - Only use `.env.example`
2. **Rotate JWT_SECRET** regularly in production
3. **Use strong passwords** for database and services
4. **Enable MFA** on all accounts (MongoDB, GitHub, etc.)
5. **Monitor logs** regularly for suspicious activity
6. **Update dependencies** frequently for security patches
7. **Use HTTPS only** (both Vercel and Render enforce this)

---

## Monitoring & Logs

### View Render Logs
1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** tab

### View Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click **"Deployments"**
4. Select latest deployment
5. View build logs or function logs

---

## Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Environment Variables Best Practices](https://12factor.net/config)

---

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure automatic deployments from GitHub
3. Set up uptime monitoring
4. Enable analytics and logging
5. Create backup strategy for database
6. Document API endpoints for external use

---

## Support & Questions

For issues or questions:
1. Check Render and Vercel documentation
2. Review logs in respective dashboards
3. Test locally before deploying changes
4. Use GitHub Issues to track problems

---

**Good luck with your deployment! 🚀**
