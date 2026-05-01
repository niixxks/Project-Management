# GitHub Setup & Repository Guide

## 🔧 Initialize Git Repository

### For Windows (PowerShell):
```powershell
cd ProjectManagementApp

# Initialize git
git init

# Configure git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack project management app with RBAC"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/project-management-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### For Mac/Linux:
```bash
cd ProjectManagementApp

git init
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git add .
git commit -m "Initial commit: Full-stack project management app with RBAC"
git remote add origin https://github.com/yourusername/project-management-app.git
git branch -M main
git push -u origin main
```

## 📝 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `project-management-app`
3. Description: `Full-stack project management app with role-based access control, built with Node.js, Express, React, MongoDB`
4. Set to Public (for deployment visibility)
5. Click "Create Repository"
6. Copy the repository URL

## 📋 GitHub Repository Setup Tips

### Add a GitHub Actions Workflow (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend
        run: |
          curl -X POST "https://api.railway.app/graphql" \
            -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
            -d '{"query":"deployment query"}'
```

### Important Files for GitHub

Your repository should contain:
- ✅ `README.md` - Project documentation
- ✅ `QUICKSTART.md` - Setup instructions
- ✅ `DEPLOYMENT.md` - Railway deployment guide
- ✅ `backend/` - Express server code
- ✅ `frontend/` - React app code
- ✅ `.gitignore` - Ignored files
- ✅ `.env.example` - Environment template

## 🚀 Deployment to Railway from GitHub

### Step 1: Connect Railway to GitHub

1. Go to https://railway.app
2. Sign up with GitHub account
3. Click "Create New Project"
4. Select "Deploy from GitHub repo"
5. Authorize Railway to access your GitHub account
6. Select your `project-management-app` repository

### Step 2: Configure Backend Deployment

1. In Railway dashboard, the project will auto-detect `package.json`
2. Go to Variables tab
3. Add environment variables:
   ```
   MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/project-management
   JWT_SECRET: [generate a strong random string]
   PORT: 5000
   NODE_ENV: production
   ```

4. Railway will automatically:
   - Detect Node.js
   - Run `npm install`
   - Run `npm start` to begin service

### Step 3: Deploy Frontend

Option A: Same Railway Project (Recommended)
1. In Railway, add another service
2. Select "GitHub"
3. Select your repo
4. Point to `/frontend` folder
5. Build command: `npm run build`
6. Start command: `npm run preview`
7. Add variable:
   ```
   VITE_API_URL: https://your-backend-url.railway.app/api
   ```

Option B: Separate Railway Project
1. Create another Railway project
2. Repeat deployment steps for frontend
3. Update frontend API URL after deployment

### Step 4: Get Your Live URLs

After deployment, Railway provides URLs:
- **Backend**: `https://projectname-production-xxxx.railway.app`
- **Frontend**: `https://projectname-frontend-production-xxxx.railway.app`

## 📊 Share Your Live App

Once deployed, share these links:

### README Update
Update the top of your `README.md`:
```markdown
# Project Management App 📊

🔗 **Live Demo**: https://projectname-frontend-production-xxxx.railway.app  
📚 **GitHub**: https://github.com/yourusername/project-management-app  
🎬 **Demo Video**: [Link to your demo video]

## Quick Features
- ✅ User authentication with JWT
- ✅ Project & team management
- ✅ Task creation and assignment
- ✅ Role-based access control (Admin/Member)
- ✅ Dashboard with analytics
```

### Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas cluster set up with database
- [ ] Railway account created
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Railway
- [ ] Environment variables configured
- [ ] Live URLs tested and working
- [ ] README updated with live URLs
- [ ] Demo video recorded (2-5 minutes)
- [ ] GitHub repo made public

## 🔐 Important Security Notes

### Before Deployment

1. **Change JWT_SECRET** - Use a strong random string
   ```bash
   # Generate on command line:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Never commit .env** - Already in `.gitignore`

3. **Use Environment Variables** - All secrets in Railway dashboard

4. **Update API URLs** - Ensure frontend points to live backend

## 📺 Demo Video Tips

Record a 2-5 minute walkthrough showing:
1. Account creation (30s)
2. Create a project (30s)
3. Add team members (30s)
4. Create and assign tasks (60s)
5. Track progress on dashboard (30s)
6. Show role-based features (30s)

Use tools like:
- OBS Studio (free)
- Loom (free tier)
- QuickTime (Mac)

## 🎯 Final Submission

Submit these 3 items:
1. **Live URL**: Working deployed application
2. **GitHub Repo**: Code with proper README
3. **Demo Video**: 2-5 minute walkthrough

Example submission:
```
📱 Live App: https://projectname-frontend-production-xxxx.railway.app
📚 GitHub: https://github.com/yourusername/project-management-app
🎬 Demo: https://yourdemo.video/link
```

## ✅ Testing Checklist

Before sharing, verify:
- [ ] Account registration works
- [ ] Login/logout works
- [ ] Create project works
- [ ] Create task works
- [ ] Assign task works
- [ ] Update task status works
- [ ] Dashboard shows statistics
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] All links work

## 🆘 Troubleshooting Deployment

### Build Fails in Railway
- Check logs in Railway dashboard
- Verify `package.json` has all dependencies
- Test `npm install` locally first

### API Connection Issues
- Verify CORS is enabled in backend
- Check backend URL in frontend `.env`
- Test backend health endpoint

### Database Issues
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

---

Good luck with your submission! 🚀
