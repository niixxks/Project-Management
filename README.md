# Project Management App 📊

A full-stack web application for collaborative project management with role-based access control, task tracking, and progress monitoring.

## 🌟 Features

✅ **User Authentication**
- Signup/Login with JWT tokens
- Secure password hashing with bcrypt
- Role-based authorization (Admin/Member)

✅ **Project Management**
- Create, update, and delete projects
- Add/remove team members
- Track project status (active, completed, on-hold)
- Set project deadlines

✅ **Task Management**
- Create and assign tasks to team members
- Track task status (todo, in-progress, review, completed)
- Set task priority (low, medium, high)
- Task due dates and deadline tracking
- Task descriptions and comments

✅ **Dashboard & Analytics**
- Overview of all projects and tasks
- Task statistics (completed, in-progress, todo)
- Overdue task tracking
- Personal task assignment tracking
- Quick status overview

✅ **Role-Based Access Control**
- **Admin**: Full access to all features and users
- **Member**: Can create projects, assign tasks, and track progress

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password security

### Frontend
- **React 18** with React Router
- **Vite** for fast development
- **Axios** for API calls
- **CSS3** for styling

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Git

## 🔧 Installation

### Clone the repository
```bash
git clone https://github.com/yourusername/project-management-app.git
cd project-management-app
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp ../.env.example .env
```

4. Update `.env` with your credentials:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management
JWT_SECRET=your_secret_key_here
PORT=5000
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members` - Remove member

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/my/tasks` - Get my tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/dashboard/stats` - Get dashboard statistics

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)
- `POST /api/users/:id/make-admin` - Make user admin (admin only)

## 🎯 Usage

### 1. Create Account
- Visit the app and click "Register"
- Fill in your details and create an account

### 2. Create a Project
- Go to "Projects" page
- Click "+ New Project"
- Fill in project details and create

### 3. Add Team Members
- Go to project details
- Use member management to add team members

### 4. Create Tasks
- In project detail view, click "+ New Task"
- Assign to team members and set priorities/deadlines

### 5. Track Progress
- View dashboard for overall statistics
- Check personal tasks in dashboard
- Update task status as work progresses

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation and sanitization

## 🚀 Deployment on Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub account

### Deployment Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Railway**
- Go to https://railway.app
- Click "Create New Project"
- Select "Deploy from GitHub"
- Authorize and select your repository

3. **Set Environment Variables**
- In Railway dashboard, go to Variables
- Add the following environment variables:
  - `MONGODB_URI`: Your MongoDB connection string
  - `JWT_SECRET`: Your JWT secret key
  - `PORT`: 5000
  - `NODE_ENV`: production

4. **Configure Build & Deploy**
- Railway will auto-detect Node.js project
- Backend will be deployed at: `https://your-project.railway.app/api`

5. **Deploy Frontend**
- Create separate Railway project for frontend
- Build command: `npm run build`
- Start command: `npm run preview`
- Update frontend API URL to backend Railway URL

### Environment Variables for Production
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_key
PORT=5000
NODE_ENV=production
```

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [ObjectId] (User[]),
  status: 'active' | 'completed' | 'on-hold',
  dueDate: Date,
  startDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  status: 'todo' | 'in-progress' | 'review' | 'completed',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test Account
You can create a test account during registration, or use:
- Email: `test@example.com`
- Password: `password123`

## 📝 Project Structure

```
ProjectManagementApp/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── ProjectDetail.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── vite.config.js
│   └── package.json
├── .env.example
└── README.md
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### CORS Errors
- Check frontend and backend URLs match
- Verify CORS is enabled in Express

### Token Expires
- Tokens expire after 30 days
- User needs to login again after expiration

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## 📄 License

MIT License - feel free to use this project for your needs

## 👥 Contributors

Created as a full-stack project management solution.

---

**Live Demo**: https://your-project.railway.app  
**GitHub Repository**: https://github.com/yourusername/project-management-app
