# 🚀 Quick Start Guide

## Project Management App - Get Running in 10 Minutes

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free: https://www.mongodb.com/cloud/atlas)

### 1️⃣ Setup MongoDB

1. Create a free account at MongoDB Atlas
2. Create a cluster
3. Create a database user
4. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/project-management
   ```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# Or on Mac/Linux: cp ../.env.example .env

# Edit .env and add:
# MONGODB_URI=your_connection_string
# JWT_SECRET=your_random_secret_key
# PORT=5000

# Start backend
npm start
# Or with auto-reload: npm run dev
```

Backend will run on: http://localhost:5000

### 3️⃣ Frontend Setup (in a new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on: http://localhost:3000

### 4️⃣ Test the App

1. Open http://localhost:3000
2. Click "Register"
3. Create an account:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
4. Login with your credentials
5. Create a project
6. Add team members
7. Create tasks and track progress!

## 🎯 Key Features to Try

✅ **Dashboard** - View overall statistics
✅ **Projects** - Create and manage projects
✅ **Tasks** - Create, assign, and update tasks
✅ **Team Management** - Add members to projects
✅ **Task Tracking** - Monitor task status and deadlines

## 📱 Test Scenarios

### Scenario 1: Simple Task Management
1. Register as user "Alice"
2. Create project "Q1 2024 Goals"
3. Go to project and add task "Build feature X"
4. Assign to "Alice"
5. Set priority to "High"
6. Check dashboard - should show 1 task "In Progress"

### Scenario 2: Team Collaboration
1. Register as user "Bob"
2. Create project "Team Project"
3. Register another user "Charlie"
4. Add "Charlie" as member (needs to be implemented UI-wise)
5. Create task and assign to "Charlie"
6. Both can track progress

### Scenario 3: Dashboard Analytics
1. Create multiple projects
2. Create tasks with different statuses
3. Dashboard will show:
   - Total projects
   - Total tasks
   - Completed count
   - In-progress count
   - Overdue count

## 🔧 Environment Variables Needed

Create `.env` in `backend/` folder:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_key_change_me_in_production

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

## 🐛 Common Issues & Solutions

### "Cannot find module 'mongoose'"
```bash
cd backend
npm install
```

### Port 5000 already in use
Change PORT in `.env` to 5001 or another available port

### MongoDB connection fails
1. Check connection string format
2. Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
3. Check username/password are correct
4. Ensure database user has proper roles

### CORS errors
Make sure backend is running and frontend API URL is correct

### Tokens not working
- Clear localStorage in browser
- Re-register and login

## 📚 Project Structure Quick Reference

```
backend/          → Express + MongoDB APIs
├── models/       → Database schemas
├── controllers/  → Business logic
├── routes/       → API endpoints
├── middleware/   → Auth & validation
└── server.js     → Main server file

frontend/         → React + Vite UI
├── pages/        → Page components
├── components/   → Reusable components
├── context/      → Auth state management
└── App.jsx       → Main app component
```

## ✨ Next Steps

1. ✅ Get it running locally
2. 🚀 Deploy to Railway (see DEPLOYMENT.md)
3. 📹 Record a demo video (2-5 min)
4. 📝 Push to GitHub with good commit messages
5. 🎯 Share live URLs and GitHub repo

## 🎬 Demo Script (2-5 minutes)

1. **Intro (15s)**: "This is a project management app with role-based access"
2. **Sign Up (20s)**: Show registration and login
3. **Dashboard (30s)**: Show analytics and overview
4. **Projects (30s)**: Create a project, show project details
5. **Tasks (30s)**: Create tasks, assign priorities, change status
6. **Filtering (20s)**: Show task filtering and sorting
7. **Conclusion (15s)**: Key features summary

## 🆘 Need Help?

Check:
1. Terminal error messages - usually very descriptive
2. Browser console (F12) - may show frontend errors
3. MongoDB Atlas - verify database exists and has data
4. Environment variables - verify all required vars are set

Happy coding! 🎉
