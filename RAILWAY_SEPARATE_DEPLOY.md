# Railway Deployment - Separate Projects (Recommended)

## 🚀 Deploy Backend & Frontend Separately

This is the EASIEST way to deploy your app on Railway.

### Step 1: Backend Deployment

1. Go to https://railway.app
2. Click "New Project" 
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway dashboard opens
6. **IMPORTANT - Configure Settings:**
   - Click "Variables" 
   - Add these:
     ```
     MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/projectmgmt
     JWT_SECRET = use_a_very_strong_secret_key_here
     NODE_ENV = production
     ```
   - If you see "Root Directory" or "Build", set:
     - **Root Directory**: `backend`
     - **Build Command**: Leave empty (uses npm start from package.json)

7. Click "Deploy"
8. Wait for deployment to complete
9. **COPY YOUR BACKEND URL** - You'll see it in Railway (like: `https://project-mgmt-backend-prod-xxxxx.railway.app`)

### Step 2: Frontend Deployment

1. Go to https://railway.app
2. Create a "New Project" (separate from backend)
3. Select "Deploy from GitHub repo"
4. Choose SAME repository
5. **IMPORTANT - Configure Settings:**
   - Click "Variables"
   - Add:
     ```
     VITE_API_URL = https://project-mgmt-backend-prod-xxxxx.railway.app/api
     ```
     (Replace with your actual backend URL from Step 1)
   
   - Set Build/Root options:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`

6. Click "Deploy"
7. Wait for completion
8. **COPY YOUR FRONTEND URL** - You'll see it (like: `https://project-mgmt-frontend-prod-xxxxx.railway.app`)

### Step 3: Test It

1. Open your Frontend URL in browser
2. Register or login with admin credentials
3. Everything should work!

## 📋 Your Credentials (Admin)

- **Email:** admin@example.com
- **Password:** admin123

## ✅ What to Check After Deployment

- [ ] Frontend loads without 404 errors
- [ ] Can login with admin account
- [ ] Can create projects
- [ ] Can assign tasks
- [ ] Can view assigned tasks on dashboard
- [ ] Can manage users (admin panel)

## 🔗 Final URLs to Share

- **Frontend**: `https://your-frontend-project.railway.app`
- **Backend**: `https://your-backend-project.railway.app`

## ⚠️ If Something Fails

### Frontend Build Fails:
- Check Railway logs for errors
- Make sure `serve` is in package.json devDependencies ✅ (already added)

### Can't Connect to Backend:
- Verify VITE_API_URL environment variable
- Use full URL: `https://backend-url.railway.app/api`
- NOT localhost!

### MongoDB Connection Error:
- Check MongoDB Atlas connection string
- Ensure IP whitelist includes `0.0.0.0/0` for Railway
- Test locally first with same connection string

## 🎯 Quick Checklist

- [x] Backend has build script ✅
- [x] Frontend has serve package ✅
- [x] Both have proper package.json ✅
- [ ] Push code to GitHub
- [ ] Deploy backend to Railway
- [ ] Get backend URL
- [ ] Deploy frontend with backend URL
- [ ] Test live deployment
