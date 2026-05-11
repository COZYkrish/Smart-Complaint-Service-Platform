# 🔧 Production Troubleshooting & Maintenance Guide

Common issues and solutions for your production deployment on Vercel and Render.

---

## 🚨 Critical Issues

### Issue: Backend Returns 503 Service Unavailable

**Symptoms**: 
- Cannot reach backend API
- Vercel shows error page
- Frontend cannot submit complaints

**Causes**:
1. Render free tier - service might be "sleeping"
2. Build failed on deployment
3. Environment variables are not set
4. MongoDB connection string is incorrect

**Solutions**:
```bash
# 1. Check if service is running (wait ~1 minute for free tier to wake)
curl https://complaint-service-backend.onrender.com/health

# 2. Check Render logs
# - Go to Render Dashboard → Select Service → Logs tab
# - Look for error messages in build or runtime logs

# 3. Verify environment variables
# - All required variables are set
# - MONGO_URI format is correct
# - No typos in variable names

# 4. Test MongoDB connection locally
# - Create a test file and try connecting
# - If it fails locally, connection string is wrong
```

### Issue: CORS Error - "Access to XMLHttpRequest blocked"

**Symptoms**:
- Console shows CORS error
- API calls fail with 403 Forbidden
- Real-time updates don't work

**Causes**:
1. `CLIENT_URL` not set or incorrect in backend
2. Frontend URL changed but backend not updated
3. Protocol mismatch (http vs https)

**Solutions**:
```javascript
// 1. Verify environment variables in Render
// In Render Dashboard:
// - Edit Service → Environment
// - Check: CLIENT_URL = https://your-vercel-url.vercel.app

// 2. Verify frontend environment variables in Vercel
// In Vercel Dashboard:
// - Select Project → Settings → Environment Variables
// - Check: VITE_API_URL = https://your-render-backend.onrender.com/api
// - Check: VITE_SOCKET_URL = https://your-render-backend.onrender.com

// 3. Trigger redeployment
// - Make a small change and git push
// - Or click "Redeploy" in dashboard
```

### Issue: Email Notifications Not Sending

**Symptoms**:
- Users don't receive registration emails
- Status update emails missing
- No email service logs appear

**Causes**:
1. Gmail app password is incorrect or regular password used
2. Two-factor authentication not enabled
3. Email service configuration is wrong
4. Email logs show failures but you didn't check them

**Solutions**:
```bash
# 1. Verify Gmail setup
# - Go to Gmail Account → Security
# - Check 2FA is enabled
# - Generate new app password if needed
# - Copy the 16-character password exactly

# 2. Update environment variables in Render
# - Go to Render Dashboard → Service → Environment
# - Check EMAIL_SERVICE = gmail
# - Check EMAIL_USER = your-email@gmail.com
# - Check EMAIL_PASSWORD = 16-character-password (NOT your regular password)
# - Redeploy

# 3. Test email service
# - Register a new account
# - Check spam folder
# - Check Render logs for email service errors
```

---

## ⚠️ Common Issues

### Issue: Real-Time Updates Not Working

**Symptoms**:
- Socket.io connection fails
- Status updates don't appear in real-time
- "Error: Unable to connect to socket" in console

**Causes**:
1. WebSocket protocol not supported
2. `VITE_SOCKET_URL` incorrect or not set
3. Backend Socket.io service not running
4. Firewall blocking WebSocket

**Solutions**:
```javascript
// 1. Check environment variables in Vercel
// VITE_SOCKET_URL = https://your-render-backend.onrender.com

// 2. Verify backend Socket.io is initialized
// - Check Render logs for "Socket.io ready"
// - Should see "Socket connected" when client connects

// 3. Check browser console
// - Look for WebSocket connection attempts
// - Verify no certificate errors
// - Check Network tab for socket.io connection

// 4. Test Socket.io connection
// In browser console:
const socket = io('https://complaint-service-backend.onrender.com', {
  auth: { token: localStorage.getItem('token') }
});
socket.on('connect', () => console.log('Connected!'));
socket.on('disconnect', () => console.log('Disconnected'));
```

### Issue: Frontend Build Fails on Vercel

**Symptoms**:
- Vercel shows "Build failed"
- Deployment is rejected
- Red X next to deployment

**Causes**:
1. TypeScript/ESLint errors in code
2. Missing dependencies in package.json
3. Incorrect environment variables
4. Node version mismatch

**Solutions**:
```bash
# 1. Test build locally
cd client
npm install
npm run build

# 2. Fix any errors shown
# - Check console for error messages
# - Fix TypeScript errors
# - Fix ESLint warnings (add // eslint-disable-line if necessary)

# 3. Verify Vercel build settings
# - Framework: Vite
# - Root Directory: ./client
# - Build Command: npm run build
# - Output Directory: dist

# 4. Check Node version
# - Vercel uses Node 20 by default
# - Should work with most modern projects
```

### Issue: Database Connection Timeout

**Symptoms**:
- MongoDB connection fails
- "MongoServerSelectionError" in logs
- Complaints can't be saved

**Causes**:
1. IP not whitelisted in MongoDB Atlas
2. Connection string is incorrect
3. MongoDB cluster is down
4. Firewall blocking connection

**Solutions**:
```bash
# 1. Verify IP whitelist in MongoDB Atlas
# - Go to MongoDB Atlas → Network Access
# - Should see 0.0.0.0/0 (allow from anywhere)
# - If not, click "Edit" and add it

# 2. Verify connection string
# - Should include username, password, cluster name
# - No special characters in password should be URL-encoded
# - Example: mongodb+srv://user:pass@cluster.mongodb.net/db

# 3. Test connection locally
# - Copy MONGO_URI to .env
# - Run: npm run dev
# - Should connect successfully

# 4. Check MongoDB Atlas status
# - Go to https://status.mongodb.com
# - Verify your region is operational
```

---

## 🐛 Debugging

### Enable Debug Logs

**Backend (Render)**:
```bash
# Add to .env or set in Render environment
DEBUG=*
LOG_LEVEL=debug

# Or modify server/index.js:
console.log('[DEBUG] Variable:', variable);
```

**Frontend (Vercel)**:
```bash
# Check browser console (F12)
# Add to .env:
VITE_DEBUG=true

# In React components:
console.log('[DEBUG]', data);
```

### Check Logs

**Render Logs**:
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Scroll to find relevant messages
5. Green logs are info, yellow are warnings, red are errors

**Vercel Logs**:
1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. Select deployment
5. Click "Runtime Logs" or "Build Logs"

---

## 📊 Monitoring

### Set Up Uptime Monitoring

```bash
# Use free services like:
# - UptimeRobot: uptimerobot.com
# - Pingdom: pingdom.com
# - StatusCake: statuscake.com

# Add endpoint to monitor:
# https://complaint-service-backend.onrender.com/health
```

### Monitor Performance

1. **Vercel Analytics**:
   - Go to Vercel Dashboard → Project → Analytics
   - Monitor Core Web Vitals
   - Check page load times

2. **Render Metrics**:
   - Go to Render Dashboard → Service → Metrics
   - Monitor CPU, Memory, Disk usage

### Set Up Error Alerts

```bash
# Option 1: Sentry (error tracking)
# - Create account at sentry.io
# - Add to frontend: npm install @sentry/react
# - Initialize in main.jsx

# Option 2: Loggly (log aggregation)
# - Create account at loggly.com
# - Send logs from both frontend and backend
```

---

## 🔄 Maintenance

### Regular Updates

```bash
# Check for security updates monthly
cd client && npm audit
cd ../server && npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies carefully
npm update
npm list --depth=0
```

### Database Maintenance

```bash
# Regular tasks:
# 1. Monitor database size
#    - Go to MongoDB Atlas → Deployment → Metrics
# 2. Clean old data (if needed)
#    - Implement data retention policy
# 3. Review indexes
#    - Ensure frequently queried fields are indexed
# 4. Backup important data
#    - Use MongoDB Atlas automated backups
```

### Deployment Maintenance

```bash
# Every month:
# 1. Review logs for errors
# 2. Update dependencies
# 3. Test full user workflow
# 4. Monitor performance metrics
# 5. Backup database

# Every quarter:
# 1. Review security headers
# 2. Update Node.js version if needed
# 3. Audit third-party integrations
# 4. Review rate limiting settings
```

---

## 🚀 Performance Optimization

### Reduce Build Time

```bash
# Frontend
# - Remove unused dependencies
# - Check bundle size: npm run build -- --analyze
# - Use dynamic imports for large components

# Backend
# - Ensure dependencies are optimized
# - Remove unused packages
# - Profile slow endpoints
```

### Improve Response Time

```bash
# Frontend
# - Implement lazy loading for images
# - Code splitting for routes
# - Cache static assets

# Backend
# - Implement caching (Redis, in-memory)
# - Optimize database queries
# - Use indexes
# - Implement pagination for large datasets
```

### Reduce Memory Usage

```bash
# Check Render metrics for memory spikes
# - Reduce cache size if needed
# - Implement cleanup for old data
# - Use streaming for large responses
```

---

## 🔐 Security Maintenance

### Regular Security Tasks

```bash
# 1. Rotate JWT_SECRET every 6 months
# - Generate new random string
# - Update in Render environment
# - Existing tokens will need re-login

# 2. Update dependencies regularly
# - npm audit
# - npm update

# 3. Review logs for suspicious activity
# - Check for failed login attempts
# - Monitor API rate limiting hits
# - Review error patterns

# 4. Change sensitive credentials
# - Gmail app password every 3 months
# - Database password annually
# - JWT secret every 6 months
```

---

## 📞 Getting Help

### Useful Resources

1. **Render Docs**: https://render.com/docs
2. **Vercel Docs**: https://vercel.com/docs
3. **MongoDB Docs**: https://docs.mongodb.com
4. **Express Docs**: https://expressjs.com
5. **React Docs**: https://react.dev

### Common Search Queries

- "Vercel CORS error"
- "Render MongoDB connection timeout"
- "Socket.io production deployment"
- "Node.js email service not sending"
- "React environment variables"

### When to Contact Support

- Service is down for 1+ hour
- Data loss or corruption
- Billing issues
- Account security concerns

---

## 📝 Incident Report Template

When something goes wrong in production:

```markdown
# Incident Report

**Date/Time**: [When did it happen?]
**Service Affected**: Frontend / Backend / Both
**Severity**: Critical / High / Medium / Low

## Symptoms
- [What went wrong?]

## Root Cause
- [Why did it happen?]

## Fix Applied
- [What was done to fix it?]

## Prevention
- [How can we prevent this in future?]

## Time to Resolution
- Detected: [Time]
- Resolved: [Time]
- Total Downtime: [Duration]
```

---

## Checklist: First Month After Launch

- [ ] Monitor logs daily
- [ ] Respond to user feedback
- [ ] Fix reported bugs
- [ ] Optimize based on performance metrics
- [ ] Update documentation
- [ ] Plan improvements
- [ ] Schedule next review (30 days)

---

**Remember**: Regular monitoring and maintenance prevent issues before they happen! 🛡️
