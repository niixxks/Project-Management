@echo off
REM Project Management App Setup Script for Windows

echo 🚀 Setting up Project Management App...

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo ✅ Setup complete!
echo.
echo To start the development environment:
echo 1. Backend: cd backend ^&^& npm start (or npm run dev)
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Don't forget to:
echo 1. Create .env file in backend folder
echo 2. Add MONGODB_URI and JWT_SECRET
echo 3. See .env.example for reference
