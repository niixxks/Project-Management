# Railway Deployment - Step by Step

## ✅ What I Fixed

1. ✅ Added `build` script to backend package.json
2. ✅ Added `start` and `serve` to frontend package.json
3. ✅ Updated railway.json files with proper deploy commands
4. ✅ Backend already uses `process.env.PORT` correctly

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects it's Node.js (backend folder)
5. Set Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/projectmgmt?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_here_make_it_strong
   NODE_ENV=production
   ```
6. Click Deploy
7. **Copy the Backend URL** from Railway (e.g., `https://project-mgmt-backend-production-xxxx.railway.app`)

### Step 3: Deploy Frontend on Railway

1. Create a "New Project" on Railway
2. "Deploy from GitHub repo" → same repo
3. Railway might auto-detect Node.js
4. **IMPORTANT**: If it doesn't specify a directory, you need to configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `frontend`
5. Set Environment Variables:
   ```
   VITE_API_URL=https://project-mgmt-backend-production-xxxx.railway.app/api
   NODE_ENV=production
   ```
   (Replace with your actual backend URL)
6. Click Deploy
7. **Copy the Frontend URL** from Railway

### Step 4: Verify Deployment

1. Visit your Frontend URL
2. Register a new account
3. Create a project
4. Assign tasks
5. Everything should work!

## ⚠️ Common Issues & Fixes

### Issue: "Build fails" or "Dependencies not found"
**Solution**: Make sure `serve` package is in frontend's devDependencies ✅ (already fixed)

### Issue: "Frontend can't connect to backend"
**Solution**: 
- Check VITE_API_URL environment variable in Railway
- Make sure you're using the full backend URL, not localhost
- Format: `https://your-backend-domain.railway.app/api`

### Issue: "Port already in use"
**Solution**: This is auto-handled by Railway - don't worry!

### Issue: "MongoDB connection fails"
**Solution**:
1. Go to MongoDB Atlas (mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user with strong password
4. Get connection string
5. **Important**: Add IP whitelist - use `0.0.0.0/0` for Railway
6. Use that connection string as MONGODB_URI

## 📊 Final URLs

After deployment, you'll have:
- **Frontend**: `https://your-frontend-app.railway.app`
- **Backend API**: `https://your-backend-app.railway.app/api`

Share these URLs with others!

## 🔧 Troubleshooting Commands (Local Testing)

Before deploying, test locally:
```bash
# Backend
cd backend
npm install
npm start

# Frontend (in new terminal)
cd frontend
npm install
npm run build
npm start
```

If these work locally, they'll work on Railway!
