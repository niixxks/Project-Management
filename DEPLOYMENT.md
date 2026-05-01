# Project Management App - Deployment Guide

## Railway Deployment Instructions

### Step 1: Prepare Your Repository

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Project Management App"
```

2. Push to GitHub:
```bash
git remote add origin https://github.com/yourusername/project-management-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Railway

1. Go to https://railway.app and sign in
2. Click "Create New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect it's a Node.js project
6. Set environment variables in Railway dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key
   - `PORT`: 5000
   - `NODE_ENV`: production

7. Railway will automatically:
   - Run `npm install` in backend folder
   - Start with `npm start`
   - Generate a public URL

Note the backend URL (e.g., `https://backend-production-xxxx.railway.app`)

### Step 3: Deploy Frontend on Railway

1. Create another project for frontend
2. Select "Deploy from GitHub" and choose same repo
3. Configure:
   - Build command: `cd frontend && npm install && npm run build`
   - Start command: `cd frontend && npm run preview`
4. Add environment variable:
   - `VITE_API_URL`: Your backend Railway URL

### Step 4: Update Frontend API Configuration

Update `frontend/src/api.js`:
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
```

### Step 5: Verify Deployment

1. Visit your frontend URL
2. Register a new account
3. Create a project
4. Create and assign tasks
5. Verify all features work

## MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Add to Railway environment variables

## Troubleshooting

### Build Fails
- Check logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### API Connection Issues
- Verify backend URL in frontend environment
- Check CORS settings in backend
- Ensure MongoDB connection string is valid

### Port Issues
- Railway assigns port automatically
- Don't hardcode port 5000 in production
- Use `process.env.PORT || 5000`

## Live URL
Once deployed, you'll get:
- Backend: `https://project-mgmt-backend-production-xxxx.railway.app`
- Frontend: `https://project-mgmt-frontend-production-xxxx.railway.app`

Share these URLs as your live demo!
